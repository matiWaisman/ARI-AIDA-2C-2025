import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderClient from "@/components/headerClient";
import FooterClient from "@/components/footerClient";
import { UserProvider } from "@/contexts/UserContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIDA",
  description: "Gestión de certificados y alumnos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <HeaderClient />
          <main className="container-page">
            <div className="card">
              {children}
            </div>
          </main>

          <FooterClient />
        </UserProvider>
      </body>
    </html>
  );
}
