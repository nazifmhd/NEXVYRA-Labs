import { ChevronDown } from "@/components/ui/Icons";

/** Native <details> disclosure — keyboard and screen-reader accessible without JS. */
export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <ul className="border-t border-line">
      {faqs.map((f) => (
        <li key={f.q} className="border-b border-line">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[1.15rem] text-navy marker:hidden hover:text-action [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-300 group-open:rotate-180">
                <ChevronDown size={16} />
              </span>
            </summary>
            <p className="max-w-3xl pb-7 text-[1rem] leading-relaxed text-muted">{f.a}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
