import { BrokerBrandingContent } from "@/components/legal/broker-branding-content";
import { ConsumerProtectionNoticeContent } from "@/components/legal/consumer-protection-notice-content";
import { FairHousingContent } from "@/components/legal/fair-housing-content";
import { IabsContent } from "@/components/legal/iabs-content";
import { LegalLocaleContent } from "@/components/legal/legal-locale-content";
import { MlsRulesAndRegulationsContent } from "@/components/legal/mls-rules-and-regulations-content";
import { MlsRuleScheduleOfFinesContent } from "@/components/legal/mls-rule-schedule-of-fines-content";
import { SecuritySurveillanceContent } from "@/components/legal/security-surveillance-content";
import { SellersDisclosureContent } from "@/components/legal/sellers-disclosure-content";
import { ValuablesMedicationsContent } from "@/components/legal/valuables-medications-content";

type LegalPageArticleProps = {
  slug: string;
};

export function LegalPageArticle({ slug }: LegalPageArticleProps) {
  return (
    <article className="glass-surface space-y-4 p-6 sm:p-8">
      {slug === "iabs" ? (
        <IabsContent />
      ) : slug === "consumer-protection-notice" ? (
        <ConsumerProtectionNoticeContent />
      ) : slug === "mls-rules-and-regulations" ? (
        <MlsRulesAndRegulationsContent />
      ) : slug === "mls-rule-schedule-of-fines" ? (
        <MlsRuleScheduleOfFinesContent />
      ) : slug === "fair-housing" ? (
        <FairHousingContent />
      ) : slug === "valuables-medications" ? (
        <ValuablesMedicationsContent />
      ) : slug === "security-surveillance" ? (
        <SecuritySurveillanceContent />
      ) : slug === "sellers-disclosure" ? (
        <SellersDisclosureContent />
      ) : slug === "broker-branding" ? (
        <BrokerBrandingContent />
      ) : slug === "terms" || slug === "privacy" ? (
        <LegalLocaleContent slug={slug} />
      ) : (
        <div className="space-y-4 text-sm text-white/80">
          <p>Legal content for this page is not available.</p>
        </div>
      )}
    </article>
  );
}
