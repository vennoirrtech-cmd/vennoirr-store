import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Terms.css";

export default function Shipping() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Shipping Policy | Vennoirr</title>
        <meta name="description" content="Shipping policy for Vennoirr." />
      </Helmet>

      <div className="legal-content">
        <h1>Vennoirr – Shipping Policy</h1>

        <section>
          <h2>1. Logistics & Fulfillment</h2>
          <p>Vennoirr uses premium logistics partners like Delhivery, Bluedart, and Ecom Express to ensure your items are handled with care and delivered on time. Based out of Nagpur, we currently fulfill orders nationwide.</p>
        </section>

        <section>
          <h2>2. Processing Times</h2>
          <p>All standard orders are processed and dispatched within 24 to 48 hours. Orders placed on Sundays or public holidays will be processed on the next business day.</p>
        </section>
        
        <section>
          <h2>3. Express Delivery (Nagpur)</h2>
          <p>We offer ultra-fast localized delivery inside Nagpur city limits. Orders placed before 6 PM IST are eligible for our exclusive 45-Minute Delivery. Availability is determined at checkout based on your exact pin code.</p>
        </section>

        <section>
          <h2>4. Tracking Your Order</h2>
          <p>Once your order is dispatched, you will receive an AWB number and tracking link directly in your Profile portal under the "Orders" tab. You will also receive Email and SMS notifications indicating dispatch and estimated delivery time.</p>
        </section>

        <section>
          <h2>5. Undeliverable Packages</h2>
          <p>If our carrier attempts delivery multiple times but is unable to reach you, the package will be returned to our facility. Refunds (minus shipping charges) will be issued for prepaid orders.</p>
        </section>
      </div>
    </div>
  );
}
