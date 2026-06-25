import type { Metadata } from "next";
import "./globals.css";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
