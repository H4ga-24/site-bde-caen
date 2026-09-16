import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BDE Éco-Gestion Caen | Adhésions, Drives & Événements",
    template: "%s | BDE Éco-Gestion Caen",
  },
  description:
    "Rejoins le BDE Éco-Gestion de l'Université de Caen ! Débloque l'accès aux Drives de cours complets (L1, L2, L3), réductions soirées, parrainages et événements.",
  keywords: [
    "BDE",
    "Éco-Gestion",
    "Caen",
    "Université de Caen",
    "UNICAEN",
    "Campus 1",
    "Drives cours L1 L2 éco gestion",
    "annales",
    "adhésion BDE",
    "soirées étudiantes",
  ],
  authors: [{ name: "BDE Éco-Gestion Caen" }],
  creator: "BDE Éco-Gestion Caen",
  metadataBase: new URL("https://site-bde-caen.vercel.app"),
  openGraph: {
    title: "BDE Éco-Gestion Caen | Adhésions & Drives de cours",
    description:
      "Adhère au BDE pour débloquer le Drive de cours complet (L1/L2/L3) et profiter de nos réductions soirées et événements !",
    url: "https://site-bde-caen.vercel.app",
    siteName: "BDE Éco-Gestion Caen",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BDE Éco-Gestion Caen",
    description: "Portail officiel et adhésions du BDE Éco-Gestion de l'Université de Caen.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-light text-slate-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}