import Link from "next/link";
import { formatDate, readingTime, type Insight } from "@/content/insights";
import { ArrowUpRight } from "@/components/ui/Icons";

export function InsightCard({ article }: { article: Insight }) {
  return (
    <article className="spot-card group relative flex h-full flex-col rounded-[1.5rem] border border-line bg-white p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-action/40">
      <div className="flex items-center justify-between font-mono text-[0.7rem] tracking-[0.12em] uppercase">
        <span className="text-action">{article.category}</span>
        <span className="text-muted">{readingTime(article.body)}</span>
      </div>
      <h3 className="mt-6 font-display text-[1.45rem] leading-snug font-medium text-navy">
        <Link href={`/insights/${article.slug}`} data-cursor="Read" className="after:absolute after:inset-0 after:content-['']">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{article.excerpt}</p>
      <div className="mt-auto flex items-center justify-between pt-7 text-[0.85rem] text-muted">
        <span>
          <time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time>
        </span>
        <ArrowUpRight size={18} className="text-action transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </article>
  );
}
