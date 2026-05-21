"use client";

import { Container } from "@/components/container";
import { useSiteLocale } from "@/components/site-locale-provider";
import { getAboutCopy } from "@/i18n/about-copy";

export function AboutPageContent() {
  const { locale, ready } = useSiteLocale();
  const copy = getAboutCopy(locale);

  return (
    <div
      className={[
        "py-10 transition-opacity duration-200 sm:py-14",
        ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <Container>
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-3">
            <div className="text-xs font-semibold tracking-widest text-white/60">
              {copy.eyebrow}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="text-base text-muted">{copy.intro}</p>
          </header>

          <div className="glass-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">{copy.optimizeTitle}</h2>
            <ul className="mt-4 grid gap-3 text-sm text-white/80">
              {copy.cards.map((card) => (
                <li
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="font-semibold text-white">{card.title}</div>
                  <div className="mt-1 text-muted">{card.body}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">{copy.styleTitle}</h2>
            <p className="mt-2 text-sm text-muted">{copy.styleBody}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
