import { BRAND_NAME, COMPANY, CONTACT, SITE_URL } from "./siteConfig";

export interface PolicySection {
  heading: string;
  body: string[];
}

export interface Policy {
  slug: string;
  title: string;
  /** Short description used for <meta description>. */
  description: string;
  intro: string;
  sections: PolicySection[];
}

// A fixed date keeps the static export deterministic across builds.
export const POLICY_LAST_UPDATED = "20 July 2026";

const CONTACT_LINE = `If you have any questions, contact us at ${CONTACT.email}. ${COMPANY.displayName}, ${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country}, ${COMPANY.postalCode}.`;

export const POLICIES: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: `How ${BRAND_NAME} collects, uses, and protects your personal data in line with UK GDPR.`,
    intro: `${COMPANY.displayName} ("we", "us", "our") is committed to protecting your privacy. This policy explains what personal data we collect, why we collect it, and your rights under the UK GDPR and the Data Protection Act 2018.`,
    sections: [
      {
        heading: "Who we are",
        body: [
          `${BRAND_NAME} is operated by ${COMPANY.legalName}, registered in the United Kingdom at ${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country}, ${COMPANY.postalCode}.`,
          `We are the data controller responsible for your personal data. You can reach us at ${CONTACT.email}.`,
        ],
      },
      {
        heading: "Information we collect",
        body: [
          "Order and account data: your name, email address, delivery and billing address, phone number, and order history.",
          "Payment data: payment is processed securely by our payment providers (including Shopify Payments). We do not store your full card details.",
          "Usage data: pages visited, device and browser information, and cookies (see our Cookie Policy).",
        ],
      },
      {
        heading: "How we use your data",
        body: [
          "To process and deliver your orders and provide customer support.",
          "To send order confirmations and, where you have consented, marketing communications you can opt out of at any time.",
          "To improve our website, prevent fraud, and meet our legal obligations.",
        ],
      },
      {
        heading: "Lawful basis",
        body: [
          "We process your data to perform our contract with you (fulfilling orders), on the basis of your consent (marketing), and for our legitimate interests (improving and securing our service).",
        ],
      },
      {
        heading: "Sharing your data",
        body: [
          "We share data only with providers who help us run the business — payment processors, shipping carriers, and analytics tools — under contracts that protect your data. We never sell your personal data.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, correct, delete, or restrict the processing of your data, to object to processing, and to data portability.",
          `To exercise any of these rights, email ${CONTACT.email}. You also have the right to complain to the Information Commissioner's Office (ICO) at ico.org.uk.`,
        ],
      },
      {
        heading: "Data retention",
        body: [
          "We keep your data only as long as necessary to fulfil the purposes above and to meet legal, accounting, and reporting requirements.",
        ],
      },
      { heading: "Contact", body: [CONTACT_LINE] },
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    description: `The terms governing your use of the ${BRAND_NAME} website and your purchases.`,
    intro: `These Terms of Service govern your use of ${SITE_URL} and any purchase you make from ${COMPANY.displayName}. By using our website or placing an order, you agree to these terms.`,
    sections: [
      {
        heading: "Overview",
        body: [
          `This website is operated by ${COMPANY.legalName}. Throughout the site, the terms "we", "us" and "our" refer to ${BRAND_NAME}.`,
        ],
      },
      {
        heading: "Products and pricing",
        body: [
          "We make every effort to display our products and prices accurately. Prices are shown in the currency displayed at checkout and include applicable taxes unless stated otherwise.",
          "We reserve the right to correct any errors, change prices, and limit order quantities at our discretion.",
        ],
      },
      {
        heading: "Orders",
        body: [
          "When you place an order you make an offer to buy. We may accept or decline it. A contract is formed when we confirm dispatch of your order.",
          "You are responsible for providing accurate delivery and contact details.",
        ],
      },
      {
        heading: "Use of the products",
        body: [
          "Our whitening products are cosmetic products for external, at-home use. Always follow the instructions provided. If you experience irritation, discontinue use and consult a dental professional.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `All content on this site — text, images, logos, and branding — is owned by or licensed to ${COMPANY.legalName} and may not be reproduced without permission.`,
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "To the fullest extent permitted by law, we are not liable for indirect or consequential loss. Nothing in these terms limits your statutory rights as a consumer.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of England and Wales, and disputes are subject to the exclusive jurisdiction of its courts.",
        ],
      },
      { heading: "Contact", body: [CONTACT_LINE] },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund & Returns Policy",
    description: `Our 30-day money-back guarantee and how to return your ${BRAND_NAME} order.`,
    intro: `We want you to love your results. Every order is covered by our 30-day money-back guarantee, in addition to your statutory rights under the UK Consumer Contracts Regulations.`,
    sections: [
      {
        heading: "30-day money-back guarantee",
        body: [
          "If you're not satisfied, you may request a refund within 30 days of receiving your order. Contact us and we'll guide you through the process.",
        ],
      },
      {
        heading: "Your right to cancel",
        body: [
          "Under the Consumer Contracts Regulations you may cancel your order within 14 days of receiving it, without giving a reason, and return the goods within 14 days of cancelling.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          `Email ${CONTACT.email} with your order number and reason for return. We'll send you return instructions.`,
          "Items should be returned in a saleable condition where possible. For hygiene reasons, opened whitening products may be non-returnable except where faulty.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Once we receive and inspect your return, we'll process your refund to your original payment method within 14 days. Original shipping costs are refundable where the item is faulty or not as described.",
        ],
      },
      {
        heading: "Faulty or incorrect items",
        body: [
          "If your item arrives damaged, faulty, or incorrect, contact us within 30 days and we'll arrange a replacement or full refund, including return postage.",
        ],
      },
      { heading: "Contact", body: [CONTACT_LINE] },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    description: `Delivery times, costs, and tracking for ${BRAND_NAME} orders.`,
    intro: `We ship worldwide. This policy explains our delivery times, costs, and how to track your order.`,
    sections: [
      {
        heading: "Processing time",
        body: [
          "Orders are processed within 1–2 business days. You'll receive a confirmation email with tracking once your order ships.",
        ],
      },
      {
        heading: "Delivery times",
        body: [
          "UK: 1–3 business days with express shipping.",
          "Europe: 3–7 business days.",
          "Rest of world: 7–14 business days.",
          "Delivery times are estimates and may vary during peak periods.",
        ],
      },
      {
        heading: "Shipping costs",
        body: [
          "Free express shipping is included on all bundles. Shipping costs for single items are calculated at checkout based on your destination.",
        ],
      },
      {
        heading: "Customs and duties",
        body: [
          "International orders may be subject to import duties or taxes set by your local authority, which are the responsibility of the recipient.",
        ],
      },
      {
        heading: "Tracking your order",
        body: [
          "Use the tracking link in your dispatch email. If your order hasn't arrived within the estimated window, contact us and we'll help.",
        ],
      },
      { heading: "Contact", body: [CONTACT_LINE] },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: `How ${BRAND_NAME} uses cookies and how you can control them.`,
    intro: `This Cookie Policy explains how ${COMPANY.displayName} uses cookies and similar technologies on ${SITE_URL}.`,
    sections: [
      {
        heading: "What are cookies?",
        body: [
          "Cookies are small text files stored on your device that help websites function and remember your preferences.",
        ],
      },
      {
        heading: "Cookies we use",
        body: [
          "Essential cookies: required for the site and cart to work.",
          "Analytics cookies: help us understand how visitors use the site so we can improve it.",
          "Marketing cookies: used, with your consent, to measure and personalise advertising.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "You can control or delete cookies through your browser settings. Blocking some cookies may affect how the site works.",
        ],
      },
      { heading: "Contact", body: [CONTACT_LINE] },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((p) => p.slug === slug);
}
