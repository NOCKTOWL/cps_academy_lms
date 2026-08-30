import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import 'lenis/dist/lenis.css'
import {ReactLenis} from 'lenis/react';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CPS Academy LMS",
  description: "A Learning Management System built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <ReactLenis root />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
