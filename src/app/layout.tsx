<<<<<<< Updated upstream
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadGen | AI Marketing Suite',
  description: 'AI-powered lead research and proposal generation for marketing agencies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
=======
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LeadGen — AI Marketing Suite",
  description:
    "AI-powered lead research, personalized outreach, and proposal generation for agencies and sales teams.",
  keywords: [
    "lead generation",
    "AI outreach",
    "proposal generator",
    "marketing suite",
    "sales automation",
  ],
  openGraph: {
    title: "LeadGen — AI Marketing Suite",
    description:
      "Research leads, write personalized outreach, and generate winning proposals — all powered by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans mesh-gradient min-h-screen`}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(222 40% 8%)",
              border: "1px solid hsl(222 30% 14%)",
              color: "hsl(210 40% 98%)",
            },
          }}
        />
      </body>
    </html>
  );
>>>>>>> Stashed changes
}
