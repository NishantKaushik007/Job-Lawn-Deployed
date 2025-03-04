import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "../components/ClientWrapper";
import NavbarConditional from "@/components/NavbarConditional"; // Updated import
import LogoutBarConditional from "@/components/LogoutBarConditional";
import DisableKeysAndContext from "@/components/DisableKeysAndContext"
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Lawn",
  description: "One portal for all the job openings from all the highest paying companies",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarConditional />
        <LogoutBarConditional />
        <DisableKeysAndContext />
        <ClientWrapper>{children}</ClientWrapper>
        <Footer />
      </body>
    </html>
  );
}
