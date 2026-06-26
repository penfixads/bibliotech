import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-brand",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Still Broke While Earning | M.A. Jacinto, CSFP",
  description:
    "Why Earning More Won't Fix Your Money Problems. A groundbreaking personal finance book by M.A. Jacinto, CSFP. Available now for ₱950.",
  openGraph: {
    title: "Still Broke While Earning",
    description: "The answer isn't more income. It's the system you've never been taught.",
    images: ["/images/cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${cinzel.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
