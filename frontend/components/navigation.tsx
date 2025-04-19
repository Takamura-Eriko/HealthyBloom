"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, User, Utensils, Menu, X, LogOut, CreditCard, Flower } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const routes = [
    {
      href: "/",
      label: "ホーム",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/health-data",
      label: "健康診断",
      icon: <Flower className="h-4 w-4 mr-2" />,
      active: pathname === "/health-data",
    },
    {
      href: "/meal-suggestions",
      label: "食事提案",
      icon: <Utensils className="h-4 w-4 mr-2" />,
      active: pathname === "/meal-suggestions",
    },
    {
      href: "/advice",
      label: "アドバイス",
      icon: <Flower className="h-4 w-4 mr-2" fill={pathname === "/advice" ? "#FFD1DC" : "none"} />,
      active: pathname === "/advice",
    },
    {
      href: "/payment",
      label: "プレミアムプラン",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      active: pathname === "/payment",
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "ログアウト成功",
        description: "ログアウトしました",
      })
      router.push("/")
    } catch (error) {
      console.error("ログアウトエラー:", error)
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      })
    }
  }

  const getUserInitials = () => {
    if (!user || !user.displayName) return "ゲ"
    const nameParts = user.displayName.split(" ")
    return nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : user.displayName[0]
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* 左側ロゴ＋メニュー */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Flower className="h-6 w-6 text-primary" fill="#FFD1DC" />
            <span className="font-bold">HealthyBloom</span>
          </Link>

          <nav className="flex items-center space-x-2 text-base font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-foreground/60"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* モバイルメニュー */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Flower className="h-5 w-5 text-primary" fill="#FFD1DC" />
            <span className="font-bold">HealthyBloom</span>
          </Link>
        </div>

        {/* ユーザー情報・ログイン/登録ボタン */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "ユーザー"} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && <p className="font-medium">{user.displayName}</p>}
                    {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>マイページ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">登録</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
