import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Terms.css"; // Reuse generic legal page styles

export default function FAQ() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>FAQ | Vennoirr</title>
        <meta name="description" content="Frequently Asked Questions (FAQ) for Vennoirr regarding orders, shipping, and returns." />
      </Helmet>

      <div className="legal-content">
        <h1>Vennoirr – Frequently Asked Questions (FAQ)</h1>

        <section>
          <h2>General & Orders</h2>
          
          <h3>What payment methods do you accept?</h3>
          <p>We accept all major credit and debit cards, secure UPI payments, and select digital wallets. All transactions are processed through encrypted, industry-standard secure payment gateways.</p>
          
          <h3>Can I modify or cancel my order after placing it?</h3>
          <p>Because we aim for fast fulfillment, we begin processing orders almost immediately. If you need to make a change or cancel, please contact our support team within 2 hours of placing the order. Once an order has been handed over to our logistics partners, we can no longer modify it, and you will need to follow our standard return process.</p>
          
          <h3>How do I know what size to order?</h3>
          <p>Each product page includes a detailed sizing chart. Because our collections feature distinct, motorsport-inspired silhouettes, we highly recommend measuring yourself and comparing the dimensions against our specific garment charts before purchasing.</p>
        </section>

        <section>
          <h2>Shipping & Delivery</h2>
          
          <h3>How long does shipping take?</h3>
          <p>Standard delivery within major metropolitan areas takes approximately 3 to 5 business days. Deliveries to more remote locations or international destinations may take 7 to 14 business days. You will receive an estimated delivery date at checkout based on your exact location.</p>
          
          <h3>How can I track my order?</h3>
          <p>As soon as your package leaves our fulfillment center, you will receive a shipping confirmation email containing a unique tracking link. You can use this link to monitor your delivery status in real-time.</p>
          
          <h3>What happens if my package is lost or damaged?</h3>
          <p>We partner with top-tier courier services to ensure safe delivery. However, if your package arrives damaged or is lost in transit, please contact us within 48 hours of the estimated delivery date so we can initiate an investigation and arrange a replacement.</p>
        </section>

        <section>
          <h2>Returns & Exchanges</h2>
          
          <h3>What is your return policy?</h3>
          <p>We offer a 14-day return and exchange window from the date of delivery. To be eligible, the apparel must be unwashed, unworn, and returned in its original packaging with all Vennoirr tags firmly attached.</p>
          
          <h3>Are any items final sale?</h3>
          <p>Yes. Custom-made items, personalized gear, and final-sale clearance items are strictly non-refundable and cannot be exchanged.</p>
          
          <h3>Do I have to pay for return shipping?</h3>
          <p>Currently, customers are responsible for covering the cost of return shipping unless the return is due to a defect or an error on our part (e.g., you received the wrong size or item).</p>
        </section>

        <section>
          <h2>Product & Brand</h2>
          
          <h3>How should I care for my Vennoirr apparel?</h3>
          <p>To preserve the bold graphics, premium fabrics, and structural integrity of our pieces, we recommend washing garments inside out on a cold, gentle cycle. Avoid using bleach or harsh detergents, and lay items flat to dry. Do not iron directly over printed graphics or logos.</p>
          
          <h3>Where is Vennoirr based?</h3>
          <p>Vennoirr is proudly designed and managed as a subsidiary of the Trivenoir Group, with our corporate operations headquartered in Nagpur, Maharashtra.</p>
        </section>

        <section>
          <h2>Still have questions?</h2>
          <p>If your question isn't answered here, please reach out directly to our customer support team via the contact form on our website, and we will get back to you within 24 hours.</p>
        </section>
      </div>
    </div>
  );
}
