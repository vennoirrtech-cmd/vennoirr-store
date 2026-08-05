import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Terms.css"; // Reuse generic legal page styles

export default function Contact() {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Contact Us | Vennoirr</title>
        <meta name="description" content="Get in touch with Vennoirr customer support and corporate office." />
      </Helmet>

      <div className="legal-content">
        <h1>Contact Vennoirr</h1>
        
        <p>We are here to assist you. Whether you have inquiries about our collections, sizing, or an existing order, our team is ready to help.</p>

        <section>
          <h2>Customer Support & General Inquiries</h2>
          <ul>
            <li><strong>Email:</strong> support@vennoirr.com</li>
            <li><strong>Phone:</strong> +91 9876543210 (Available Mon-Fri, 10 AM to 6 PM)</li>
            <li><strong>Response Time:</strong> Please allow 24–48 hours for a response from our concierge team.</li>
          </ul>
        </section>

        <section>
          <h2>Corporate Office</h2>
          <p>
            <strong>Vennoirr / Trivenoir Group</strong><br/>
            Plot No. 45, Fashion Street, Dharampeth,<br/>
            Nagpur, Maharashtra 440010, India
          </p>
        </section>

        <section>
          <h2>Business Hours</h2>
          <ul>
            <li><strong>Monday – Friday:</strong> 10:00 AM – 6:00 PM (IST)</li>
            <li><strong>Saturday & Sunday:</strong> Closed</li>
          </ul>
        </section>
        
        <section>
          <h2>Follow Us</h2>
          <p>Stay updated on new drops and exclusive releases:</p>
          <ul>
            <li><strong>Instagram:</strong> @Vennoirr</li>
            <li><strong>X (Twitter):</strong> @Vennoirr</li>
          </ul>
        </section>

        <section>
          <p><em>For fast resolutions regarding orders, please include your Order ID in the subject line of your email.</em></p>
        </section>
      </div>
    </div>
  );
}
