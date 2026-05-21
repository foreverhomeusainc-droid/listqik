import { Container } from "@/components/container";
import { LegalPageArticle } from "@/components/legal/legal-page-article";
import { LegalPageHeader } from "@/components/legal/legal-page-header";

type LegalPageBodyProps = {
  slug: string;
  updatedAt: string;
  fallbackTitle: string;
};

export function LegalPageBody({ slug, updatedAt, fallbackTitle }: LegalPageBodyProps) {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl space-y-8">
          <LegalPageHeader
            slug={slug}
            updatedAt={updatedAt}
            fallbackTitle={fallbackTitle}
          />
          <LegalPageArticle slug={slug} />
        </div>
      </Container>
    </div>
  );
}
