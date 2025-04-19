"use client"

import { usePathname } from "next/navigation"
import Navigation from "@/components/navigation"
import { useAuth } from "@/lib/authProvider"

export default function LayoutWithConditionalNavigation({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()

  const alwaysHiddenPaths = ["/login", "/signup"]
  const isTopPageAndNotLoggedIn = pathname === "/" && !user

  const hideNavigation = alwaysHiddenPaths.includes(pathname) || isTopPageAndNotLoggedIn

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {!hideNavigation && <Navigation />}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-primary/5 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} HealthyBloom - 主婦のための健康管理アプリ
        </div>
      </footer>
    </div>
  )
}
