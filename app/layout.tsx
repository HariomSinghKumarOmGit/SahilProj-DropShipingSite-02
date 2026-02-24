import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Modern GSAP eCommerce",
  description: "Next.js + GSAP + Tailwind Storefront",
};

import Header from "@/components/ui/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${poppins.variable} ${montserrat.variable} antialiased text-gray-900 bg-white font-poppins`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
