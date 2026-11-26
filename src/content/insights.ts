/**
 * Insights (blueprint §5.7). Articles are original engineering writing by the
 * NEXVYRA Labs team. Body is structured blocks so pages can build a table of
 * contents and render code safely. Move to MDX or a CMS when editors need it.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "callout"; text: string };

export type InsightCategory = "AI Engineering" | "Agentic AI" | "Software Engineering" | "Automation" | "Engineering Notes" | "Company Updates";

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory;
  author: string;
  publishDate: string; // ISO date
  updatedDate?: string;
  body: Block[];
  related?: string[];
};

const AUTHOR = "NEXVYRA Labs Engineering";

export const insights: Insight[] = [
  {
    slug: "evaluate-llm-features-before-shipping",
    title: "Evaluate your LLM feature before it ships",
    excerpt:
      "“It looked good in the demo” is not a release criterion. A practical way to build an evaluation set, choose graders and turn quality into something you can measure on every change.",
    category: "AI Engineering",
    author: AUTHOR,
    publishDate: "2026-11-27",
    related: ["rag-that-holds-up-in-production"],
    body: [
      {
        type: "p",
        text: "Most LLM features fail quietly. They answer fluently, so nobody notices when a prompt change makes them slightly worse, or when a model upgrade changes behaviour on the cases that matter most. The fix is not more prompt tweaking. It is treating quality as something you measure, the same way you measure test coverage or latency.",
      },
      { type: "h2", id: "define-the-job", text: "Start by defining the job" },
      {
        type: "p",
        text: "Before writing a single test case, write down what the feature is for and what a wrong answer costs. A support assistant that occasionally gives a vague answer is annoying; one that confidently states the wrong refund policy creates liability. The cost of error decides how strict your evaluation needs to be and where a human must stay in the loop.",
      },
      {
        type: "ul",
        items: [
          "Who uses the output, and what do they do with it?",
          "What does a good answer contain — and what must it never contain?",
          "When should the system refuse or escalate instead of answering?",
        ],
      },
      { type: "h2", id: "build-the-set", text: "Build a small, honest evaluation set" },
      {
        type: "p",
        text: "You do not need thousands of examples to start. Fifty to a hundred well-chosen cases will catch most regressions. The important word is honest: the set should look like real traffic, including the awkward cases, not like the examples you used while building the prompt.",
      },
      {
        type: "ol",
        items: [
          "Collect real inputs where you can — support tickets, search logs, emails — with personal data removed.",
          "Add edge cases deliberately: ambiguous questions, out-of-scope requests, adversarial phrasing, missing information.",
          "Write the expected behaviour for each case, not necessarily the exact expected text.",
          "Keep a held-out slice you never look at while tuning, so you can check you have not overfit.",
        ],
      },
      { type: "h2", id: "choose-graders", text: "Choose graders that match the question" },
      {
        type: "p",
        text: "Different properties need different checks. Use the cheapest grader that answers the question reliably, and reserve model-based grading for judgments code cannot make.",
      },
      {
        type: "ul",
        items: [
          "Code checks for anything deterministic: valid JSON, required fields present, length limits, forbidden phrases, a citation exists.",
          "Reference comparison when there is a known right answer, such as an extracted invoice total.",
          "Model-graded rubrics for qualities like groundedness or helpfulness — with a specific rubric, and spot-checked against human judgment.",
          "Human review for a sample of outputs, especially early on and for high-risk categories.",
        ],
      },
      {
        type: "code",
        lang: "ts",
        code: `type EvalCase = {
  id: string;
  input: string;
  expect: {
    mustCite?: boolean;      // answer must reference a source
    shouldEscalate?: boolean; // system should hand off, not answer
    mustNotContain?: string[];
  };
};

function gradeDeterministic(c: EvalCase, out: { text: string; citations: string[]; escalated: boolean }) {
  const failures: string[] = [];
  if (c.expect.mustCite && out.citations.length === 0) failures.push("missing citation");
  if (c.expect.shouldEscalate !== undefined && out.escalated !== c.expect.shouldEscalate)
    failures.push(c.expect.shouldEscalate ? "should have escalated" : "escalated unnecessarily");
  for (const phrase of c.expect.mustNotContain ?? [])
    if (out.text.toLowerCase().includes(phrase.toLowerCase())) failures.push(\`contains "\${phrase}"\`);
  return { id: c.id, pass: failures.length === 0, failures };
}`,
      },
      { type: "h2", id: "make-it-routine", text: "Make it part of every change" },
      {
        type: "p",
        text: "An evaluation you run once is a report. An evaluation you run on every prompt, model or retrieval change is a safety net. Wire it into your release process so a change that lowers the pass rate on a critical category is blocked, just like a failing unit test.",
      },
      {
        type: "callout",
        text: "Track results per category, not just one overall score. A two-point overall gain can hide a ten-point drop on the cases that carry the most risk.",
      },
      { type: "h2", id: "keep-it-growing", text: "Let production grow the set" },
      {
        type: "p",
        text: "Once the feature is live, every correction a reviewer makes and every complaint a user raises is a new test case. Feeding those back into the evaluation set is how quality improves over time instead of drifting.",
      },
    ],
  },
  {
    slug: "rag-that-holds-up-in-production",
    title: "Retrieval that holds up in production",
    excerpt:
      "Retrieval-augmented generation is easy to demo and hard to get right. The decisions that matter most — chunking, ranking, permissions and citations — and how to make each one measurable.",
    category: "AI Engineering",
    author: AUTHOR,
    publishDate: "2026-11-27",
    related: ["evaluate-llm-features-before-shipping"],
    body: [
      {
        type: "p",
        text: "Retrieval-augmented generation (RAG) gives a language model the right information at the moment it answers, so it can respond from your documents instead of from memory. The idea is simple. The quality of the result depends almost entirely on the retrieval half, which is where most production problems start.",
      },
      { type: "h2", id: "chunking", text: "Chunk by meaning, not by character count" },
      {
        type: "p",
        text: "Splitting documents into fixed-size pieces is the default in many tutorials, and it routinely cuts a policy in half or separates a table from its heading. Prefer boundaries that follow the document's structure — sections, headings, list items — and keep useful context such as the document title and section path with every chunk.",
      },
      {
        type: "ul",
        items: [
          "Respect headings and sections; keep tables and their captions together.",
          "Attach metadata to each chunk: source, section, last-updated date, access level.",
          "Test chunking choices against your evaluation set rather than by inspection.",
        ],
      },
      { type: "h2", id: "ranking", text: "Combine search methods, then re-rank" },
      {
        type: "p",
        text: "Semantic (vector) search is good at meaning but can miss exact terms such as product codes, names and clause numbers. Keyword search is the opposite. Running both and merging the results — then re-ranking the top candidates — is usually more robust than either alone.",
      },
      {
        type: "callout",
        text: "Set a relevance floor. When nothing scores above it, the right behaviour is to say so or escalate — not to answer from weak matches.",
      },
      { type: "h2", id: "permissions", text: "Carry permissions into the index" },
      {
        type: "p",
        text: "If a person cannot open a document in your systems, the assistant must not quote it to them. Store access information alongside each chunk at indexing time and filter on it at query time, before anything reaches the model. Retrofitting permissions later is far harder than designing them in.",
      },
      { type: "h2", id: "citations", text: "Make every answer checkable" },
      {
        type: "p",
        text: "Ask the model to cite the passages it used, and show those citations to users. Citations do two jobs: they let people verify answers, and they give you a direct signal for evaluation — an answer whose claims are not supported by its citations is a failure, however fluent it sounds.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Shape the retrieval step so evaluation can inspect it later.
type Retrieved = { chunkId: string; source: string; section: string; score: number; text: string };

function selectContext(results: Retrieved[], floor = 0.6, max = 6) {
  const kept = results.filter((r) => r.score >= floor).slice(0, max);
  return {
    context: kept,
    // Nothing relevant enough: hand off instead of guessing.
    shouldEscalate: kept.length === 0,
  };
}`,
      },
      { type: "h2", id: "measure", text: "Measure retrieval separately from answers" },
      {
        type: "p",
        text: "When an answer is wrong, you need to know whether retrieval missed the right passage or the model misused it. Log what was retrieved for every request and evaluate the two stages separately: did the right source appear in the top results, and was the answer faithful to what was retrieved?",
      },
      {
        type: "ol",
        items: [
          "Retrieval: for each test question, is the correct source in the top results?",
          "Faithfulness: are the answer's statements supported by the retrieved text?",
          "Behaviour: did the system escalate when nothing relevant was found?",
        ],
      },
    ],
  },
  {
    slug: "automations-that-fail-loudly",
    title: "Design automations that fail loudly",
    excerpt:
      "The most expensive automation is the one that stopped working three weeks ago and nobody noticed. Principles for workflows that are visible, recoverable and safe to rely on.",
    category: "Automation",
    author: AUTHOR,
    publishDate: "2026-11-27",
    body: [
      {
        type: "p",
        text: "Automations are usually built to handle the happy path: a form arrives, data is copied, a notification is sent. Real operations are full of exceptions — missing fields, duplicate records, a third-party API that is down for an hour. Whether an automation saves time or quietly creates a mess depends on how it behaves when something goes wrong.",
      },
      { type: "h2", id: "visible-state", text: "Give every run a visible state" },
      {
        type: "p",
        text: "Each item moving through a workflow should have a status you can look up: received, processing, waiting for approval, completed, failed. If the only way to know whether something happened is to check three different tools, you do not have an automation — you have a guessing game.",
      },
      { type: "h2", id: "idempotency", text: "Make steps safe to retry" },
      {
        type: "p",
        text: "Networks fail and services time out, so retries are inevitable. A step is idempotent when running it twice has the same effect as running it once — for example, creating a record only if one with the same external ID does not already exist. Without this, a retry can send two invoices or book the same appointment twice.",
      },
      {
        type: "code",
        lang: "ts",
        code: `async function createInvoiceOnce(orderId: string, payload: InvoiceInput) {
  // Use a stable key derived from the business event, not a random ID.
  const key = \`invoice:\${orderId}\`;
  const existing = await invoices.findByIdempotencyKey(key);
  if (existing) return existing; // safe to retry
  return invoices.create({ ...payload, idempotencyKey: key });
}`,
      },
      { type: "h2", id: "exceptions", text: "Design the exception path first" },
      {
        type: "p",
        text: "For every workflow, decide upfront what happens to the cases it cannot handle. The best default is an exception queue: a single place where items that need a person land, with enough context to resolve them quickly — what was attempted, what failed and what the original input was.",
      },
      {
        type: "ul",
        items: [
          "Retry transient errors automatically, with backoff and a limit.",
          "Route permanent errors — invalid data, business-rule failures — to a person.",
          "Never drop an item silently; every input ends in a known state.",
        ],
      },
      { type: "h2", id: "ai-steps", text: "Treat AI steps as probabilistic" },
      {
        type: "p",
        text: "Classification, extraction and drafting by AI models are powerful additions to a workflow, but they are not deterministic. Validate their outputs against a schema, check confidence where you can, and send uncertain or high-impact results for review rather than straight into a system of record.",
      },
      {
        type: "callout",
        text: "A useful rule: AI can propose, but anything irreversible or customer-facing above a defined risk level is confirmed by a person.",
      },
      { type: "h2", id: "monitoring", text: "Alert on silence, not just errors" },
      {
        type: "p",
        text: "Error alerts catch crashes. They do not catch a webhook that stopped firing or a filter that now matches nothing. Monitor expected volume as well: if a workflow that normally processes forty items a day processes none, that deserves an alert even though nothing technically failed.",
      },
    ],
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}

export function readingTime(body: Block[]) {
  const words = body
    .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "code" in b ? b.code : ""))
    .join(" ")
    .split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
