"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { primaryNav } from "@/config/site";
import { services } from "@/content/services";
import { insights } from "@/content/insights";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight, ChevronDown, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";
import { Logo } from "./Logo";

const nav = primaryNav.filter((item) => item.href !== "/insights" || insights.length > 0);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const servicesWrapRef = useRef<HTMLDivElement>(null);
  const servicesBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const servicesMenuId = useId();
  const drawerId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setServicesOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Services dropdown: outside click + Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!servicesWrapRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesBtnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const closeDrawer = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuBtnRef.current?.focus());
  }, []);

  // Mobile drawer: scroll lock, initial focus, focus trap, Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const onResize = () => window.innerWidth >= 1280 && closeDrawer(false);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, closeDrawer]);

  const openWithHover = () => {
    window.clearTimeout(hoverTimer.current);
    setServicesOpen(true);
  };
  const closeWithHover = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setServicesOpen(false), 160);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        // No backdrop-filter while the drawer is open: it would become the drawer's containing block.
        menuOpen
          ? "bg-white shadow-[0_1px_0_0_var(--color-line)]"
          : scrolled
            ? "bg-white/80 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 xl:px-12">
        <Logo />

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href}>
                  <div
                    ref={servicesWrapRef}
                    className="relative"
                    onPointerEnter={(e) => e.pointerType === "mouse" && openWithHover()}
                    onPointerLeave={(e) => e.pointerType === "mouse" && closeWithHover()}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setServicesOpen(false);
                    }}
                  >
                    <button
                      ref={servicesBtnRef}
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls={servicesMenuId}
                      onClick={() => setServicesOpen((o) => !o)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.94rem] transition-colors hover:text-action",
                        isActive(pathname, "/services") ? "text-action" : "text-navy",
                      )}
                    >
                      Services
                      <ChevronDown
                        size={15}
                        className={cn("transition-transform duration-300", servicesOpen && "rotate-180")}
                      />
                    </button>

                    <div
                      id={servicesMenuId}
                      hidden={!servicesOpen}
                      className="absolute top-full left-1/2 w-[min(44rem,90vw)] -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_60px_-30px_rgb(16_43_70/0.35)]">
                        <ul className="grid grid-cols-2 gap-px bg-line">
                          {services.map((s) => (
                            <li key={s.slug} className="bg-white">
                              <Link
                                href={`/services/${s.slug}`}
                                className="group flex h-full gap-4 p-5 transition-colors hover:bg-mist focus-visible:bg-mist"
                              >
                                <ServiceGlyph slug={s.slug} className="h-10 w-10 shrink-0 text-action" />
                                <span>
                                  <span className="flex items-center gap-2 font-display text-[1rem] font-medium text-navy">
                                    {s.title}
                                    <ArrowUpRight
                                      size={14}
                                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                                    />
                                  </span>
                                  <span className="mt-1 block text-[0.86rem] leading-snug text-muted">{s.kicker}</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/services"
                          className="flex items-center justify-between bg-navy px-5 py-3.5 text-[0.9rem] text-white transition-colors hover:bg-action"
                        >
                          <span>All services overview</span>
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ) : item.href === "/contact" ? null : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.94rem] transition-colors hover:text-action",
                      isActive(pathname, item.href) ? "text-action" : "text-navy",
                    )}
                  >
                    {item.label}
                    {isActive(pathname, item.href) && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-action" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            aria-current={isActive(pathname, "/contact") ? "page" : undefined}
            className="hidden px-3 py-2 text-[0.94rem] text-navy transition-colors hover:text-action xl:inline-block"
          >
            Contact
          </Link>
          <ButtonLink href="/contact" arrow className="px-5! py-2.5! text-[0.92rem] max-sm:hidden!">
            Start a Project
          </ButtonLink>
          <button
            ref={menuBtnRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-navy xl:hidden"
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => (menuOpen ? closeDrawer() : setMenuOpen(true))}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-white xl:hidden"
      >
        <div className="bp-grid-fine pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <nav aria-label="Mobile" className="relative px-5 pt-6 pb-10 sm:px-8">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-4 font-display text-[1.6rem] text-navy"
                >
                  <span className="font-mono text-[0.75rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
                {item.href === "/services" && (
                  <ul className="-mt-1 grid gap-1 pb-4 pl-10">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="block py-1.5 text-[1rem] text-muted">
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <ButtonLink href="/contact" arrow className="mt-8 w-full">
            Start a Project
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
