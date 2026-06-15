"use client";

import Script from "next/script";
import { Container } from "@/components/container";
import { getGhlFormCopy } from "@/i18n/ghl-form-copy";
import type { HomeLocale } from "@/i18n/home-locale";
import { getGhlInlineForm, ghlInlineFormIframeId } from "@/lib/ghl-inline-form";

type GhlInlineFormSectionProps = {
  locale: HomeLocale;
  /** Use start-now page shell section classes instead of Container layout. */
  variant?: "marketing" | "start-now";
};

export function GhlInlineFormSection({ locale, variant = "marketing" }: GhlInlineFormSectionProps) {
  const copy = getGhlFormCopy(locale);
  const form = getGhlInlineForm(locale);
  const iframeId = ghlInlineFormIframeId(form.formId);

  const heading = (
    <div className={variant === "start-now" ? "sectionHeading" : "mx-auto max-w-2xl text-center"}>
      {variant === "start-now" ? (
        <>
          <p className="sectionKicker">{copy.sectionKicker}</p>
          <h2 id="ghl-form-heading">{copy.title}</h2>
          <p>{copy.subtitle}</p>
        </>
      ) : (
        <>
          <h2 id="ghl-form-heading" className="text-xl font-semibold text-white sm:text-2xl">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm text-white/65">{copy.subtitle}</p>
        </>
      )}
    </div>
  );

  const formFrame = (
    <div
      className={
        variant === "start-now"
          ? "ghlFormFrame"
          : "mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-emerald-500/20 bg-white/[0.02] p-1 sm:p-2"
      }
    >
      <div className="relative w-full" style={{ minHeight: form.heightPx }}>
        <iframe
          src={form.iframeSrc}
          id={iframeId}
          title={form.formName}
          data-layout='{"id":"INLINE"}'
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name={form.formName}
          data-height={String(form.heightPx)}
          data-layout-iframe-id={iframeId}
          data-form-id={form.formId}
          className="absolute inset-0 h-full w-full rounded-lg border-0"
        />
      </div>
    </div>
  );

  if (variant === "start-now") {
    return (
      <section className="section ghlFormSection reveal" aria-labelledby="ghl-form-heading">
        {heading}
        {formFrame}
        <Script src={form.embedScriptSrc} strategy="afterInteractive" />
      </section>
    );
  }

  return (
    <section className="border-t border-white/10 bg-black/30 py-12 sm:py-14" aria-labelledby="ghl-form-heading">
      <Container>
        {heading}
        {formFrame}
      </Container>
      <Script src={form.embedScriptSrc} strategy="afterInteractive" />
    </section>
  );
}
