import type React from "react"
import type { Metadata } from "next"
import { M_PLUS_Rounded_1c } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/navigation"
import { AuthProvider } from "../lib/authProvider"

const mplus = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

// タイトルを変更
export const metadata: Metadata = {
  title: "HealthyBloom - 主婦のための健康管理アプリ",
  description: "健康診断結果の管理、食事提案、生活習慣の改善アドバイスを提供します",
    generator: 'v0.dev'
}

// フッターの名前も変更
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={mplus.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
            <footer className="bg-primary/5 py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} HealthyBloom - 主婦のための健康管理アプリ
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'