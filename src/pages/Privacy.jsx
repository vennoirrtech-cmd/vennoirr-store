import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Terms.css"; // Reuse generic legal page styles

export default function Privacy() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Privacy Policy | Vennoirr</title>
        <meta name="description" content="Read the Privacy Policy for Vennoirr, detailing data collection, processing, and storage practices." />
      </Helmet>

      <div className="legal-content">
        <h1>Vennoirr – Privacy Policy</h1>


        <section>
          <h2>1. Introduction</h2>
          <p>Vennoirr, a subsidiary of the Trivenoir Group (hereinafter referred to as "the Company," "we," "us," or "our"), is committed to the protection of individual privacy and the secure management of personal data. This Privacy Policy delineates the protocols governing the collection, processing, storage, and disclosure of personal information obtained through our website, digital platforms, and e-commerce services (collectively, the "Service").</p>
          <p>By accessing the Service or engaging in commercial transactions with the Company, you acknowledge and agree to the data practices described herein. We advise a thorough review of this document to ensure a comprehensive understanding of your rights and our legal obligations.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>In the course of providing premium e-commerce services, the Company collects several categories of information, including but not limited to:</p>
          <ul>
            <li><strong>Personally Identifiable Information (PII):</strong> Full legal name, electronic mail address, telephonic contact details, and requisite shipping and billing coordinates provided during account registration or order placement.</li>
            <li><strong>Financial Transactional Data:</strong> Payment details processed via secure, PCI-DSS compliant third-party gateways. The Company does not retain full primary account numbers (PANs) or sensitive authentication data on its internal servers.</li>
            <li><strong>Technical and Usage Metadata:</strong> Automatically logged data including Internet Protocol (IP) addresses, browser specifications, operating system configurations, and session-based navigational history.</li>
            <li><strong>Transaction History:</strong> We maintain records of the apparel and accessories you have purchased, your sizing preferences, order dates, and customer service interactions to better serve your future needs.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Utilize Your Information</h2>
          <p>The Company utilizes collected data for specific, lawful purposes essential to its business operations and service delivery:</p>
          <ul>
            <li><strong>Contractual Performance:</strong> To facilitate the execution of purchase agreements, coordinate logistics with authorized carriers, and provide requisite transactional notifications.</li>
            <li><strong>Regulatory and Support Services:</strong> To manage customer inquiries, process returns or exchanges in accordance with Company policy, and maintain platform integrity.</li>
            <li><strong>Personalization and Marketing:</strong> With your explicit consent, we may use your email address to send you updates about new motorsport-inspired collections, exclusive brand drops, and promotional offers. You can opt out of these communications at any time.</li>
            <li><strong>Internal Analytics:</strong> Analysis of anonymized technical data to optimize platform performance, enhance user interface (UI) architecture, and ensure network security.</li>
            <li><strong>Fraud Prevention:</strong> To detect, prevent, and mitigate fraudulent transactions, unauthorized account access, and other illegal activities.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Third-Party Disclosure</h2>
          <p>The Company does not engage in the sale or unauthorized trade of personal data. Information sharing is restricted to the following professional contexts:</p>
          <ul>
            <li><strong>Authorized Service Providers:</strong> Disclosure to vetted third-party partners (e.g., logistics, payment processors) necessary for the provision of services. Such entities are contractually bound to maintain stringent confidentiality and data protection standards.</li>
            <li><strong>Corporate Affiliates:</strong> As part of the Trivenoir Group, data may be shared internally within our corporate structure for administrative, operational, and auditing purposes.</li>
            <li><strong>Statutory Disclosure:</strong> We reserve the right to disclose personal information as required by judicial proceedings, court orders, or legislative mandates to protect the legal rights and safety of the Trivenoir Group and its stakeholders.</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookies and Tracking Technologies</h2>
          <p>Our website utilizes "cookies" and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us remember your preferences, keep items in your shopping cart, and analyze site traffic. You have the ability to accept or decline cookies through your browser settings. However, please be aware that declining cookies may limit your ability to use certain essential features of our website, such as completing a purchase.</p>
        </section>

        <section>
          <h2>6. Data Retention and Security</h2>
          <p>The Company implements industry-standard technical and organizational measures, including SSL encryption, to mitigate risks of unauthorized access or data exfiltration. While we adhere to rigorous security protocols, the Company acknowledges that no electronic transmission is entirely immune to compromise; thus, absolute security cannot be guaranteed. We retain your personal information only for as long as is strictly necessary to fulfill the purposes outlined in this Privacy Policy, comply with our legal and tax obligations, resolve disputes, and enforce our agreements.</p>
        </section>

        <section>
          <h2>7. Your Data Protection Rights</h2>
          <p>Depending on your jurisdiction, you possess specific rights regarding your personal data. You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we currently hold about you.</li>
            <li><strong>Correction:</strong> Request that we correct any inaccurate or incomplete personal information.</li>
            <li><strong>Erasure:</strong> Request the deletion of your personal data from our systems, subject to certain legal exceptions (e.g., retaining data for tax purposes).</li>
            <li><strong>Opt-Out:</strong> Withdraw your consent for marketing communications at any time by clicking the "unsubscribe" link in our emails or contacting us directly.</li>
          </ul>
        </section>

        <section>
          <h2>8. Third-Party Links</h2>
          <p>Our website may contain links to external sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        </section>

        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our operational practices or legal obligations. Any changes will be posted immediately on this page, with a revised "Last Updated" date at the top of the document. We encourage you to review this policy periodically.</p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to our dedicated support team.</p>
          <p><strong>Vennoirr Legal & Compliance Team</strong><br/>
          Trivenoir Group Corporate Office<br/>
          Nagpur, Maharashtra, India</p>
        </section>
      </div>
    </div>
  );
}
