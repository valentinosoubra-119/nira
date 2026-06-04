import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nira — Annuaire des cabinets comptables en France",
  description:
    "Découvrez les cabinets d'expertise comptable en France et leur score de maturité IA. Trouvez le bon partenaire pour votre entreprise.",
  keywords: ["cabinet comptable", "expertise comptable", "France", "intelligence artificielle", "maturité IA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
