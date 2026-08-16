import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import PromoPopup from "./components/PromoPopup";
import CartDrawer from "./components/CartDrawer";
import Analytics from "./components/Analytics";
import RouteTracker from "./components/RouteTracker";
import { SOCIALS, CONTACT, COMPANY, SITE_URL } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const SITE_NAME = "CLINI WHITE";
const SITE_DESCRIPTION =
  "Shop CLINI WHITE worldwide for peroxide-free at-home teeth whitening and colour-correcting oral care. Explore product-specific directions, ingredients and support.";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CLINI WHITE | Worldwide At-Home Teeth Whitening",
    template: "%s | CLINI WHITE",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "teeth whitening",
    "at-home teeth whitening",
    "peroxide-free whitening",
    "professional teeth whitening",
    "PAP whitening",
    "whitening kit",
    "whitening strips",
    "whitening pen",
    "whitening toothpaste",
    "sensitive teeth whitening",
    "CLINI WHITE",
    "worldwide teeth whitening",
    "cosmetic dentistry",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "health & beauty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "CLINI WHITE | Worldwide At-Home Teeth Whitening",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "CLINI WHITE — Worldwide At-Home Teeth Whitening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLINI WHITE | Worldwide At-Home Teeth Whitening",
    description: SITE_DESCRIPTION,
    images: ["/hero.jpeg"],
    creator: "@cliniwhite",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // google: "your-google-verification-code",
    // other: { 'msvalidate.01': 'your-bing-verification-code' },
  },
};

export const viewport: Viewport = {
  themeColor: "#231b50",
  width: "device-width",
  initialScale: 1,
  // No maximumScale / userScalable restriction — pinch-to-zoom must stay
  // available for accessibility (WCAG 1.4.4).
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  legalName: COMPANY.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: SITE_DESCRIPTION,
  email: CONTACT.email,
  sameAs: [SOCIALS.facebook, SOCIALS.instagram, SOCIALS.tiktok],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT.email,
    availableLanguage: ["English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.street,
    addressLocality: COMPANY.city,
    postalCode: COMPANY.postalCode,
    addressCountry: COMPANY.country,
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "GB",
    returnPolicyCountry: "GB",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    refundType: "https://schema.org/FullRefund",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": ORGANIZATION_ID },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-[#231b50] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-bold"
        >
          Skip to content
        </a>
        <Analytics />
        <RouteTracker />
        {children}
        <CartDrawer />
        <PromoPopup />
      </body>
    </html>
  );
}
