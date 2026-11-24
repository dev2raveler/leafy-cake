import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import Link from "next/link"

import "@workspace/ui/globals.css"
import "./customer-theme.css"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "리피 케이크",
  description: "레터링 케이크 픽업 주문",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <header className="border-b bg-card">
              <div className="mx-auto flex h-14 max-w-5xl items-center px-5 sm:px-8">
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight text-primary"
                >
                  리피 케이크
                </Link>
              </div>
            </header>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
