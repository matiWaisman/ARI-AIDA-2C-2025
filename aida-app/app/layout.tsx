import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "AIDA",
  description: "Gestión de certificados y alumnos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-white border-b border-gray-200">
          <div className="container-page flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              <Link href="/">AIDA</Link>
            </h1>
            <nav className="text-sm text-gray-600">Alumnos • Profesores</nav>
          </div>
        </header>
        <main className="container-page">
          <div className="card">
            {children}
          </div>
        </main>
        <footer className="mt-10 border-t border-gray-200 bg-white">
          <div className="container-page text-xs text-gray-500 py-4">
            © {new Date().getFullYear()} Facultad - AIDA
          </div>
        </footer>
      </body>
    </html>
  );
}
