import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Miniverso",
    template: "%s · Miniverso",
  },
  description:
    "Experiências imersivas em VR, AR e 3D feitas em São Luís (MA) para marcas de todo o Brasil.",
  appleWebApp: {
    capable: true,
    title: "Miniverso",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#6c4cff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
