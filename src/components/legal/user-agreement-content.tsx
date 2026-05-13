/**
 * ListQik.com User Agreement
 * Source: ListQik User Agreement.pdf (Last Updated: May 12, 2026)
 *
 * Shown to users as a gate between account creation and listing setup so they
 * can acknowledge the platform/brokerage structure before configuring their MLS
 * listing.
 */
export function UserAgreementContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-white/85">
      <p className="text-xs uppercase tracking-[0.18em] text-white/55">
        Last Updated: May 12, 2026
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">1. Structure of Services</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-white/95">The Platform:</span> ListQik is a real estate
            technology and marketing platform provided by David Josh, a licensed Texas Real Estate
            Agent sponsored by Central Metro Realty.
          </li>
          <li>
            <span className="font-medium text-white/95">Non-Brokerage Entity:</span> ListQik is not
            a licensed real estate brokerage. All brokerage services are fulfilled by Central Metro
            Realty, the Broker of Record.
          </li>
          <li>
            <span className="font-medium text-white/95">Fees:</span> Fees paid to ListQik are for
            Technology &amp; Marketing Services, including platform access, lead-generation tools,
            and marketing coordination.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">2. Mandatory Brokerage Relationship</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-white/95">Agency Disclosure:</span> By using this
            Site, you acknowledge receipt of the Texas Real Estate Commission Information About
            Brokerage Services (IABS) and the Consumer Protection Notice.
          </li>
          <li>
            <span className="font-medium text-white/95">Listing Fulfillment:</span> You understand
            that your property will be listed through Central Metro Realty. Following your purchase
            of a marketing package, a Limited Service Listing Agreement will be sent to you for
            manual signature to comply with TRELA &sect;1101.557.
          </li>
          <li>
            <span className="font-medium text-white/95">Written Consent:</span> Per 2026 Texas Law
            (SB 1968), no brokerage acts will be performed until that written agreement is executed.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">
          3. &ldquo;Limited Service&rdquo; Logic (The $500 Silver Tier)
        </h2>
        <p>
          To remain compliant with the mandatory &ldquo;Minimum Services&rdquo; in Texas, the
          following applies to all basic marketing packages:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-white/95">Offer Presentation:</span> ListQik provides
            the digital technology to facilitate the receipt and presentation of offers to you.
          </li>
          <li>
            <span className="font-medium text-white/95">Support &amp; Questions:</span> The platform
            includes access to a digital knowledge base for general contract questions.
          </li>
          <li>
            <span className="font-medium text-white/95">Negotiation Disclaimer:</span> The base
            marketing fee does not include human-led strategic negotiation, drafting of
            counter-offers, or active price advocacy. These are available only as &ldquo;Full
            Transaction Management&rdquo; or &ldquo;Active Broker Participation&rdquo; upgrades.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">
          4. User Obligations &amp; Representation
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-white/95">FSBO Status:</span> While your property is
            listed on the MLS, you elect to perform your own negotiations and scheduling to the
            extent permitted by law, with the Broker providing required legal oversight.
          </li>
          <li>
            <span className="font-medium text-white/95">Direct Communication:</span> You
            acknowledge that in Texas, buyer&rsquo;s agents must deliver offers to the Listing
            Broker (Central Metro), who will then present them to you via the ListQik platform.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">5. Branding &amp; Regulatory Compliance</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-white/95">Broker Visibility:</span> Resolution Realty
            Group is a team sponsored by Central Metro Realty.
          </li>
          <li>
            <span className="font-medium text-white/95">Logo Compliance:</span> The Central Metro
            Realty logo is displayed on this site at a minimum of 50% the size of the ListQik or
            Resolution Realty Group logo.
          </li>
        </ul>
      </section>
    </div>
  );
}
