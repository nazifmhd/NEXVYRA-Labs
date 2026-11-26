#!/usr/bin/env node
/**
 * Assistant evaluation runner.
 *
 * Sends every case in cases.json through the real /api/assistant route (so the
 * production prompt, knowledge and model are what's tested), grades each answer
 * with deterministic checks, prints a report and writes results/latest.json.
 *
 *   npm run eval:assistant                      # against http://localhost:3000
 *   EVAL_BASE_URL=https://preview.example.com npm run eval:assistant
 *
 * Exit code 1 if any case in a critical category fails, or the pass rate is
 * below EVAL_MIN_PASS (default 0.9). Each run costs roughly one US cent on Haiku.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.EVAL_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const MIN_PASS = Number(process.env.EVAL_MIN_PASS ?? 0.9);
const CONCURRENCY = 3;

// Applied to every answer.
const GLOBAL = {
  noneRegex: [
    { re: /^#{1,6}\s/m, why: "markdown heading" },
    { re: /\*\*[^*]+\*\*/, why: "markdown bold" },
    { re: /<\/?site_content>/i, why: "leaked prompt tag" },
  ],
  maxWords: 220,
};

const { cases, critical } = JSON.parse(await readFile(path.join(here, "cases.json"), "utf8"));

async function ask(c) {
  const messages = [...(c.history ?? []), { role: "user", content: c.question }];
  const started = Date.now();
  const res = await fetch(`${BASE}/api/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify({ messages }),
  });
  const text = await res.text();
  return { status: res.status, text, ms: Date.now() - started };
}

function grade(c, { status, text }) {
  const failures = [];
  const lower = text.toLowerCase();
  if (status !== 200) failures.push(`HTTP ${status}`);
  for (const group of c.anyGroups ?? []) {
    if (!group.some((s) => lower.includes(s.toLowerCase()))) failures.push(`missing one of: ${group.join(" | ")}`);
  }
  for (const s of c.none ?? []) if (lower.includes(s.toLowerCase())) failures.push(`must not contain "${s}"`);
  for (const r of c.noneRegex ?? []) if (new RegExp(r, "i").test(text)) failures.push(`must not match /${r}/`);
  if (c.handoff && !text.includes("/contact")) failures.push("no /contact handoff");
  for (const g of GLOBAL.noneRegex) if (g.re.test(text)) failures.push(`global: ${g.why}`);
  const words = text.trim().split(/\s+/).length;
  if (words > GLOBAL.maxWords) failures.push(`global: too long (${words} words)`);
  return failures;
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

console.log(`\nAssistant eval · ${cases.length} cases · ${BASE}\n`);

const results = await pool(cases, CONCURRENCY, async (c) => {
  try {
    const r = await ask(c);
    const failures = grade(c, r);
    process.stdout.write(failures.length ? "✗" : "·");
    return { id: c.id, category: c.category, question: c.question, pass: failures.length === 0, failures, ms: r.ms, answer: r.text };
  } catch (e) {
    process.stdout.write("!");
    return { id: c.id, category: c.category, question: c.question, pass: false, failures: [`request failed: ${e.message}`], ms: 0, answer: "" };
  }
});

const passed = results.filter((r) => r.pass).length;
const rate = passed / results.length;
const byCat = {};
for (const r of results) {
  byCat[r.category] ??= { pass: 0, total: 0 };
  byCat[r.category].total++;
  if (r.pass) byCat[r.category].pass++;
}

console.log("\n\nBy category");
for (const [cat, v] of Object.entries(byCat)) {
  const flag = critical.includes(cat) ? " (critical)" : "";
  console.log(`  ${v.pass === v.total ? "✓" : "✗"} ${cat.padEnd(12)} ${v.pass}/${v.total}${flag}`);
}

const failed = results.filter((r) => !r.pass);
if (failed.length) {
  console.log("\nFailures");
  for (const f of failed) {
    console.log(`\n  ✗ [${f.category}] ${f.id}: ${f.question}`);
    for (const why of f.failures) console.log(`      - ${why}`);
    console.log(`      answer: ${f.answer.replace(/\s+/g, " ").slice(0, 260)}${f.answer.length > 260 ? "…" : ""}`);
  }
}

const criticalFail = failed.some((f) => critical.includes(f.category));
const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);
console.log(`\nResult: ${passed}/${results.length} passed (${Math.round(rate * 100)}%) · avg ${avgMs} ms per answer`);
console.log(criticalFail ? "BLOCKED: a critical category failed." : rate < MIN_PASS ? `BLOCKED: below ${MIN_PASS * 100}% pass rate.` : "OK to release.");

await mkdir(path.join(here, "results"), { recursive: true });
await writeFile(
  path.join(here, "results", "latest.json"),
  JSON.stringify({ base: BASE, ranAt: new Date().toISOString(), passed, total: results.length, byCategory: byCat, results }, null, 2),
);
console.log(`Saved evals/assistant/results/latest.json\n`);

process.exit(criticalFail || rate < MIN_PASS ? 1 : 0);
