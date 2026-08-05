import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Terms.css"; // Reuse generic legal page styles

export default function Returns() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Returns & Exchange | Vennoirr</title>
        <meta name="description" content="Return and Exchange Policy for Vennoirr." />
      </Helmet>

      <div className="legal-content">
        <h1>Vennoirr – Return & Exchange Policy</h1>


        <section>
          <h2>1. Policy Overview</h2>
          <p>At Vennoirr, we strive to deliver premium quality and exceptional craft in every piece. If you are not entirely satisfied with your purchase, we offer a hassle-free return and exchange process within 14 days from the date of delivery.</p>
        </section>

        <section>
          <h2>2. Eligibility Criteria</h2>
          <p>To qualify for a return or exchange, all items must fulfill the following requirements:</p>
          <ul>
            <li><strong>Condition:</strong> Items must be unworn, unwashed, unaltered, and free of stains, odors, or pet hair.</li>
            <li><strong>Packaging:</strong> Products must be returned in their original Vennoirr packaging with all branded tags, labels, and hygiene seals intact.</li>
            <li><strong>Proof of Purchase:</strong> A valid order number or digital tax invoice is required for processing.</li>
          </ul>
        </section>

        <section>
          <h2>3. Non-Returnable & Non-Exchangeable Items</h2>
          <p>The following items are strictly final sale and cannot be returned or exchanged:</p>
          <ul>
            <li>Customized, personalized, or made-to-order apparel.</li>
            <li>Intimate wear, undergarments, or socks (due to hygiene standards).</li>
            <li>Items marked explicitly as Clearance or Final Sale.</li>
          </ul>
        </section>

        <section>
          <h2>4. Return & Exchange Process</h2>
          <ol>
            <li><strong>Submit Request:</strong> Email our support team with your order ID, photos of the item, and the reason for return/exchange.</li>
            <li><strong>Review & Approval:</strong> Our quality assurance team will review your request within 24–48 hours.</li>
            <li><strong>Pickup / Ship Back:</strong> Upon approval, a reverse pickup will be scheduled, or instructions for self-shipping will be provided.</li>
            <li><strong>Inspection & Resolution:</strong> Once received, the item undergoes inspection. Refunds or replacement shipments are processed within 3–5 business days post-inspection.</li>
          </ol>
        </section>

        <section>
          <h2>5. Refunds & Store Credit</h2>
          <ul>
            <li><strong>Approved Returns:</strong> Refunds are issued back to the original payment method within 5–7 business days after inspection.</li>
            <li><strong>COD Orders:</strong> Cash on Delivery refunds are processed via bank transfer or store credit based on your preference.</li>
            <li><strong>Shipping Charges:</strong> Original shipping fees are non-refundable unless the return is due to a manufacturing defect or wrong item sent by Vennoirr.</li>
          </ul>
        </section>

        <section>
          <h2>6. Damaged, Defective, or Incorrect Items</h2>
          <p>If you receive a defective item or an incorrect size/style:</p>
          <ul>
            <li>Notify us within 48 hours of delivery with clear unboxing photos/videos.</li>
            <li>We will arrange a priority pick-up and ship the correct replacement at zero additional cost.</li>
          </ul>
        </section>

        <section>
          <h2>7. Contact for Support</h2>
          <p>Vennoirr Customer Care<br/>
          Email: support@vennoirr.com<br/>
          Phone: +91 9876543210 (Mon-Fri, 10 AM to 6 PM)<br/>
          Trivenoir Group Corporate Office, Plot No. 45, Fashion Street, Dharampeth, Nagpur, Maharashtra 440010, India</p>
        </section>
      </div>
    </div>
  );
}
