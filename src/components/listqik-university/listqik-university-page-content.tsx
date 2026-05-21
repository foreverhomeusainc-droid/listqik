"use client";

import { Container } from "@/components/container";
import { useSiteLocale } from "@/components/site-locale-provider";
import { getListqikUniversityCopy } from "@/i18n/listqik-university-copy";
import type { YouTubeChannelFeed } from "@/lib/youtube-channel";

type ListqikUniversityPageContentProps = {
  feed: YouTubeChannelFeed;
};

function formatPublished(iso: string, locale: "en" | "es") {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(locale === "es" ? "es-US" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function ListqikUniversityPageContent({ feed }: ListqikUniversityPageContentProps) {
  const { locale, ready } = useSiteLocale();
  const copy = getListqikUniversityCopy(locale);

  return (
    <div
      className={[
        "py-10 transition-opacity duration-200 sm:py-14",
        ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <Container>
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-4">
            <div className="text-xs font-semibold tracking-widest text-white/60">
              {copy.eyebrow}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="text-base text-muted">{copy.intro}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={feed.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
              >
                {copy.subscribe}
              </a>
              <a
                href={feed.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                {copy.channelCta} ↗
              </a>
            </div>
            <p className="text-xs font-mono text-white/45">
              {feed.channelTitle} · {copy.updatedNote}
            </p>
          </header>

          <div className="glass-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">{copy.whatYouLearnTitle}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {copy.topics.map((topic) => (
                <li
                  key={topic.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="font-semibold text-white">{topic.title}</div>
                  <div className="mt-1 text-sm text-muted">{topic.body}</div>
                </li>
              ))}
            </ul>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{copy.latestTitle}</h2>
              <p className="mt-1 text-sm text-muted">{copy.latestHint}</p>
            </div>

            {feed.videos.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {feed.videos.map((video, index) => (
                  <article key={video.id} className="glass-surface overflow-hidden">
                    <div className="p-5">
                      {index === 0 ? <span className="chip">{copy.featuredLabel}</span> : null}
                      <h3
                        className={[
                          "font-semibold text-white",
                          index === 0 ? "mt-3 text-lg" : "text-base",
                        ].join(" ")}
                      >
                        {video.title}
                      </h3>
                      {video.publishedAt ? (
                        <p className="mt-1 text-xs font-mono text-white/50">
                          {formatPublished(video.publishedAt, locale)}
                        </p>
                      ) : null}
                      {video.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-muted">{video.description}</p>
                      ) : null}
                      <a
                        href={video.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-semibold text-emerald-200/90 hover:text-emerald-100"
                      >
                        {copy.watchOnYoutube} ↗
                      </a>
                    </div>
                    <div className="aspect-video w-full bg-black/30">
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="glass-surface p-8 text-center">
                <div className="text-lg font-semibold text-white">{copy.emptyTitle}</div>
                <p className="mt-2 text-sm text-muted">{copy.emptyBody}</p>
                <a
                  href={feed.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[40px] items-center rounded-full border border-emerald-400/70 bg-emerald-500/20 px-4 text-sm font-semibold tracking-wide text-emerald-100 transition hover:bg-emerald-400/30"
                >
                  {copy.subscribe}
                </a>
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
