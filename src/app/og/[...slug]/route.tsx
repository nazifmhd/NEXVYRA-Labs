import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ogEntries } from "@/lib/og/registry";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamicParams = false; // only pages in the registry; everything is prebuilt at build time

export function generateStaticParams() {
  return Object.keys(ogEntries()).map((p) => ({ slug: p === "/" ? ["home"] : p.slice(1).split("/") }));
}

const W = 1200;
const H = 630;

async function assets() {
  const nm = (p: string) => readFile(path.join(process.cwd(), "node_modules", p));
  const [display, body, mono, mark] = await Promise.all([
    nm("@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff"),
    nm("@fontsource/inter/files/inter-latin-400-normal.woff"),
    nm("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff"),
    readFile(path.join(process.cwd(), "public", siteConfig.brand.logoMark)),
  ]);
  return { display, body, mono, mark: `data:image/jpeg;base64,${mark.toString("base64")}` };
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join("/") === "home" ? "/" : `/${slug.join("/")}`;
  const entry = ogEntries()[key];
  if (!entry) return new Response("Not found", { status: 404 });

  const a = await assets();
  const titleSize = entry.title.length > 60 ? 54 : entry.title.length > 38 ? 64 : 76;
  const host = siteConfig.siteUrl.replace(/^https?:\/\//, "");
  const description = entry.description.length > 118 ? `${entry.description.slice(0, 115).replace(/\s+\S*$/, "").replace(/[\s,;:—–-]+$/, "")}…` : entry.description;

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", position: "relative", background: "#0A1C2F", fontFamily: "Inter", color: "#FFFFFF" }}>
        {/* Blueprint grid */}
        {Array.from({ length: Math.ceil(W / 56) }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", left: i * 56, top: 0, width: 1, height: H, background: "rgba(168,216,255,0.07)" }} />
        ))}
        {Array.from({ length: Math.ceil(H / 56) }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", top: i * 56, left: 0, height: 1, width: W, background: "rgba(168,216,255,0.07)" }} />
        ))}
        {/* Glow */}
        <div style={{ position: "absolute", right: -160, top: -120, width: 720, height: 720, borderRadius: 9999, backgroundImage: "radial-gradient(circle at center, rgba(54,140,235,0.30) 0%, rgba(54,140,235,0.12) 35%, rgba(10,28,47,0) 70%)" }} />

        {/* Intelligence Core mark */}
        <svg width="380" height="380" viewBox="0 0 400 400" style={{ position: "absolute", right: 70, top: 125 }}>
          <ellipse cx="200" cy="200" rx="185" ry="54" fill="none" stroke="rgba(168,216,255,0.25)" transform="rotate(-18 200 200)" />
          <polygon points="200,70 312.6,135 312.6,265 200,330 87.4,265 87.4,135" fill="rgba(217,238,255,0.10)" stroke="rgba(168,216,255,0.7)" strokeWidth="1.5" />
          <polygon points="200,135 256.3,232.5 143.7,232.5" fill="rgba(255,255,255,0.18)" stroke="rgba(168,216,255,0.7)" strokeWidth="1.5" />
          <path d="M200 135 L200 70 M200 135 L312.6 135 M200 135 L87.4 135 M256.3 232.5 L312.6 135 M256.3 232.5 L312.6 265 M256.3 232.5 L200 330 M143.7 232.5 L87.4 135 M143.7 232.5 L87.4 265 M143.7 232.5 L200 330" stroke="rgba(168,216,255,0.45)" strokeWidth="1.2" />
          <circle cx="200" cy="200" r="34" fill="rgba(54,140,235,0.45)" />
          <circle cx="200" cy="200" r="11" fill="#FFFFFF" />
          <circle cx="372" cy="150" r="6" fill="#368CEB" />
        </svg>

        {/* Content */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: "64px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={a.mark} width={56} height={56} style={{ borderRadius: 14 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Space Grotesk", fontSize: 30, letterSpacing: 6 }}>{siteConfig.brand.wordmark}</span>
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, letterSpacing: 9, color: "#A8D8FF" }}>{siteConfig.brand.wordmarkSub}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 3, color: "#368CEB", textTransform: "uppercase" }}>
              <div style={{ width: 40, height: 2, background: "#368CEB" }} />
              {entry.label}
            </div>
            <div style={{ marginTop: 22, fontFamily: "Space Grotesk", fontSize: titleSize, lineHeight: 1.04, letterSpacing: -1.5 }}>{entry.title}</div>
            <div style={{ marginTop: 22, fontSize: 24, lineHeight: 1.4, color: "rgba(168,216,255,0.8)" }}>{description}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "JetBrains Mono", fontSize: 16, letterSpacing: 2, color: "rgba(168,216,255,0.6)", textTransform: "uppercase" }}>
            <span>{siteConfig.brand.tagline}</span>
            <span>{host}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: "Space Grotesk", data: a.display, weight: 600, style: "normal" },
        { name: "Inter", data: a.body, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: a.mono, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    },
  );
}
