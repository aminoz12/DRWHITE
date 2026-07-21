import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import PromoPopup from "./components/PromoPopup";
import CartDrawer from "./components/CartDrawer";
import Analytics from "./components/Analytics";
import { STATS, SOCIALS, CONTACT, COMPANY } from "@/lib/siteConfig";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cliniwhite.com";
const SITE_NAME = "CLINI WHITE";
const SITE_DESCRIPTION =
  `CLINI WHITE — UK's #1 professional at-home teeth whitening brand. Peroxide-free, dentist-grade whitening that delivers up to 8 shades whiter in 7 days with zero sensitivity. Trusted by ${STATS.customers} customers.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CLINI WHITE | UK's #1 Professional At-Home Teeth Whitening",
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
    "dentist-grade whitening",
    "whitening kit",
    "whitening strips",
    "whitening pen",
    "whitening toothpaste",
    "sensitive teeth whitening",
    "CLINI WHITE",
    "UK teeth whitening",
    "8 shades whiter",
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-GB": SITE_URL,
      "en-US": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "CLINI WHITE | UK's #1 Professional At-Home Teeth Whitening",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "CLINI WHITE — Professional At-Home Teeth Whitening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLINI WHITE | UK's #1 Professional At-Home Teeth Whitening",
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
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: SITE_DESCRIPTION,
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
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
        <Analytics />
        {children}
        <CartDrawer />
        <PromoPopup />
      </body>
    </html>
  );
}
