import type React from "react"
import type { Metadata } from "next"
import { M_PLUS_Rounded_1c } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "../lib/authProvider"
import LayoutWithConditionalNavigation from "@/components/LayoutWithConditionalNavigation"

const mplus = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "HealthyBloom - 主婦のための健康管理アプリ",
  description: "健康診断結果の管理、食事提案、生活習慣の改善アドバイスを提供します",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="overflow-x-hidden">
      <body className={`${mplus.className} bg-transparent overflow-x-hidden`}>
        <AuthProvider>
          <LayoutWithConditionalNavigation>{children}</LayoutWithConditionalNavigation>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
