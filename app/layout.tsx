import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://livnipeyzaj.com"),
  title: "Livni Peyzaj — Profesyonel Peyzaj Hizmetleri | Ankara",
  description:
    "Ankara'da 10 yılı aşkın tecrübesiyle profesyonel peyzaj tasarımı, bahçe düzenleme, sulama sistemleri ve bakım hizmetleri.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/logo.jpeg", type: "image/jpeg" }],
    shortcut: ["/logo.jpeg"],
    apple: [{ url: "/logo.jpeg", type: "image/jpeg" }],
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://livnipeyzaj.com",
    siteName: "Livni Peyzaj",
    title: "Livni Peyzaj — Profesyonel Peyzaj Hizmetleri | Ankara",
    description:
      "Ankara'da 10 yılı aşkın tecrübesiyle profesyonel peyzaj tasarımı, bahçe düzenleme, sulama sistemleri ve bakım hizmetleri.",
    images: [
      {
        url: "/site-fotolar/hero-ana-1.png",
        width: 1200,
        height: 630,
        alt: "Livni Peyzaj proje görseli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livni Peyzaj — Profesyonel Peyzaj Hizmetleri | Ankara",
    description:
      "Ankara'da 10 yılı aşkın tecrübesiyle profesyonel peyzaj tasarımı, bahçe düzenleme, sulama sistemleri ve bakım hizmetleri.",
    images: ["/site-fotolar/hero-ana-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Sabit iletişim: telefon + WhatsApp (sağ alt) */}
        <div
          className="fixed z-50 flex flex-col items-end gap-2 right-4 bottom-4 sm:right-6 sm:bottom-6 max-w-[calc(100vw-2rem)]"
          style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom, 0px))" }}
        >
          <a
            href="tel:+903124317872"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 sm:text-[15px]"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="whitespace-nowrap tracking-tight">0312 431 78 72</span>
          </a>
          <a
            href="https://wa.me/905322251185"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#20bd5a] sm:text-[15px]"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.855L0 24l6.335-1.502A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.88 9.88 0 01-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374A9.856 9.856 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </body>
    </html>
  );
}
