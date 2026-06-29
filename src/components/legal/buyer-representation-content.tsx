import Link from "next/link";

export function BuyerRepresentationContent() {
  return (
    <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-white/80">
      <p>
        This Buyer Representation acknowledgment establishes a brokerage relationship between you
        and <strong className="text-emerald-100">Central Metro Realty</strong> (Broker of Record for
        ListQik) for acquiring investment property in Texas.
      </p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-emerald-100">What you unlock</h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>Full MLS buyer deal feed with private remarks and investor scoring</li>
          <li>Comparable sales analysis (comps) tied to active MLS inventory</li>
          <li>Buyer-side representation for offers, negotiations, and contract strategy</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-emerald-100">Broker duties (summary)</h3>
        <p>
          As your buyer&apos;s agent, the broker must perform minimum duties including loyalty,
          confidentiality, and disclosure of material facts about properties and transactions known
          to the agent — including information disclosed by the seller or seller&apos;s agent.
        </p>
        <p>
          Buyer agent compensation is <strong>not</strong> set by law and is fully negotiable. Any
          compensation may be paid by you, the seller, or another source as permitted by law.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-emerald-100">Texas disclosures</h3>
        <p>
          Review the Information About Brokerage Services (IABS) and Consumer Protection Notice
          before signing. ListQik provides marketing technology; brokerage services are performed by
          the licensed broker.
        </p>
        <p>
          <Link href="/resources/legal/iabs" className="font-semibold text-emerald-300 underline">
            Read IABS
          </Link>{" "}
          ·{" "}
          <Link
            href="/resources/legal/consumer-protection-notice"
            className="font-semibold text-emerald-300 underline"
          >
            Consumer Protection Notice
          </Link>
        </p>
      </section>

      <p className="text-xs text-white/50">
        This summary does not replace a signed TREC or broker-specific Buyer Representation
        Agreement. A formal agreement may be required before submitting offers.
      </p>
    </div>
  );
}
