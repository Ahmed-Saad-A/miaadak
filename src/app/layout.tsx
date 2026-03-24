// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Miaadak - Appointment Booking",
  description: "Book appointments easily with our modern booking platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}