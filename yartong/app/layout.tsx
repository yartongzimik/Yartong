import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

/**
 * Root metadata shared across the complete Yartong platform.
 *
 * Individual pages can extend or override these values later.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://yartong.com"),

  title: {
    default: "Yartong — Find Workers, Contractors and Materials",
    template: "%s | Yartong",
  },

  description:
    "Yartong connects customers with skilled providers, labourers, contractors and construction-material suppliers, starting in Senapati.",

  applicationName: "Yartong",

  keywords: [
    "Yartong",
    "Senapati workers",
    "construction workers",
    "skilled providers",
    "labourers",
    "contractors",
    "construction materials",
    "material suppliers",
    "quick jobs",
    "local services",
  ],

  authors: [
    {
      name: "Yartong",
      url: "https://yartong.com",
    },
  ],

  creator: "Yartong",
  publisher: "Yartong",

  category: "marketplace",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://yartong.com",
    siteName: "Yartong",
    title: "Yartong — Find Workers, Contractors and Materials",
    description:
      "Find trusted local workers, contractors, labourers and construction-material suppliers through Yartong.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Yartong — Find Workers, Contractors and Materials",
    description:
      "Find trusted local workers, contractors, labourers and construction-material suppliers through Yartong.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",

  referrer: "origin-when-cross-origin",

  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};

/**
 * Global browser viewport configuration.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,

  viewportFit: "cover",

  colorScheme: "dark",

  themeColor: [
    {
      media: "(prefers-color-scheme: dark)",
      color: "#08080b",
    },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Permanent Yartong root layout.
 *
 * Public headers, dashboard shells and page-specific navigation will be
 * rendered by their appropriate route layouts rather than being forced
 * into every page from this root.
 */
export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en-IN"
      dir="ltr"
      suppressHydrationWarning
    >
      <body>
        <a
          className="skip-link"
          href="#main-content"
        >
          Skip to main content
        </a>

        <noscript>
          <div className="noscript-message">
            JavaScript is required for account access, messaging, job
            posting and other interactive Yartong features.
          </div>
        </noscript>

        <div
          id="main-content"
          className="site-root"
          tabIndex={-1}
        >
          {children}
        </div>

        {/*
          Accessible status announcements.

          Components can update this region when searches complete,
          messages send, forms save or errors occur.
        */}
        <div
          id="yartong-live-region"
          className="live-region"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />

        <div
          id="yartong-alert-region"
          className="live-region"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        />

        {/*
          Portal targets for future modals, previews, menus and toasts.
        */}
        <div id="modal-root" />
        <div id="popover-root" />
        <div id="toast-root" />
      </body>
    </html>
  );
}