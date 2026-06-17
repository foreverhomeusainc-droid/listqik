import { Container } from "@/components/container";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/components/social-icons";
import { getSocialLeadCopy } from "@/i18n/social-lead-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import {
  getListQikYoutubeChannelUrl,
  LISTQIK_FACEBOOK_MESSENGER_URL,
  LISTQIK_INSTAGRAM_URL,
  LISTQIK_TIKTOK_URL,
} from "@/lib/social-links";

type SocialLeadCtaSectionProps = {
  locale: HomeLocale;
  variant?: "marketing" | "start-now";
};

const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function SocialLeadCtaSection({
  locale,
  variant = "marketing",
}: SocialLeadCtaSectionProps) {
  const copy = getSocialLeadCopy(locale);
  const youtubeUrl = getListQikYoutubeChannelUrl(locale);

  const heading = (
    <div className={variant === "start-now" ? "sectionHeading" : "mx-auto max-w-2xl text-center"}>
      <h2
        id="social-lead-heading"
        className={
          variant === "start-now"
            ? undefined
            : "text-xl font-semibold text-white sm:text-2xl"
        }
      >
        {copy.title}
      </h2>
      <p className={variant === "start-now" ? undefined : "mt-2 text-sm text-white/65"}>
        {copy.subtitle}
      </p>
    </div>
  );

  const actions =
    variant === "start-now" ? (
      <div className="heroActions socialLeadActions">
        <a
          href={LISTQIK_INSTAGRAM_URL}
          {...externalLinkProps}
          className="btn btnPrimary wide"
        >
          <InstagramIcon className="h-5 w-5 shrink-0" />
          {copy.instagramCta}
        </a>
        <a href={LISTQIK_TIKTOK_URL} {...externalLinkProps} className="btn btnSecondary wide">
          <TiktokIcon className="h-5 w-5 shrink-0" />
          {copy.tiktokCta}
        </a>
        <a href={youtubeUrl} {...externalLinkProps} className="btn btnSecondary wide">
          <YoutubeIcon className="h-5 w-5 shrink-0" />
          {copy.youtubeCta}
        </a>
        <a href={LISTQIK_FACEBOOK_MESSENGER_URL} {...externalLinkProps} className="btn btnSecondary wide">
          <FacebookIcon className="h-5 w-5 shrink-0" />
          {copy.facebookCta}
        </a>
      </div>
    ) : (
      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4">
        <a
          href={LISTQIK_INSTAGRAM_URL}
          {...externalLinkProps}
          className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center gap-2.5 rounded-full border border-emerald-400/80 bg-emerald-500/30 px-8 text-base font-semibold tracking-wide text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400/40 sm:min-h-[56px]"
        >
          <InstagramIcon className="h-5 w-5 shrink-0" />
          {copy.instagramCta}
        </a>
        <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            href={LISTQIK_TIKTOK_URL}
            {...externalLinkProps}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/85 transition hover:border-white/25 hover:bg-white/10 sm:min-w-[7.5rem] sm:flex-none"
          >
            <TiktokIcon className="h-4 w-4 shrink-0" />
            {copy.tiktokCta}
          </a>
          <a
            href={youtubeUrl}
            {...externalLinkProps}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/85 transition hover:border-white/25 hover:bg-white/10 sm:min-w-[7.5rem] sm:flex-none"
          >
            <YoutubeIcon className="h-4 w-4 shrink-0" />
            {copy.youtubeCta}
          </a>
          <a
            href={LISTQIK_FACEBOOK_MESSENGER_URL}
            {...externalLinkProps}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/85 transition hover:border-white/25 hover:bg-white/10 sm:min-w-[7.5rem] sm:flex-none"
          >
            <FacebookIcon className="h-4 w-4 shrink-0" />
            {copy.facebookCta}
          </a>
        </div>
      </div>
    );

  if (variant === "start-now") {
    return (
      <section
        className="section socialLeadSection reveal"
        aria-labelledby="social-lead-heading"
      >
        {heading}
        {actions}
      </section>
    );
  }

  return (
    <section
      className="border-t border-emerald-500/15 bg-emerald-950/10 py-12 sm:py-14"
      aria-labelledby="social-lead-heading"
    >
      <Container>
        {heading}
        {actions}
      </Container>
    </section>
  );
}
