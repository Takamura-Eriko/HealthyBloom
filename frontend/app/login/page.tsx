"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "パスワードは8文字以上である必要があります",
  }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true)

    try {
      await signIn(data.email, data.password)
      toast({
        title: "ログイン成功",
        description: "HealthTrackerへようこそ！",
      })
      router.push("/")
    } catch (error: any) {
      console.error("ログインエラー:", error)

      let errorMessage = "ログインに失敗しました"
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "メールアドレスまたはパスワードが正しくありません"
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "ログイン試行回数が多すぎます。しばらく経ってから再試行してください"
      }

      toast({
        title: "エラー",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-14rem)]">
      <Card className="w-full max-w-md cute-card">
        <CardHeader>
          <CardTitle className="text-2xl handwritten-heading">ログイン</CardTitle>
          <CardDescription>HealthyBloomへようこそ！アカウント情報を入力してログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            <Link href="/reset-password" className="text-primary hover:underline">
              パスワードをお忘れですか？
            </Link>
          </div>
          <div className="text-sm text-center">
            アカウントをお持ちでない場合は
            <Link href="/register" className="text-primary hover:underline ml-1">
              新規登録
            </Link>
            してください
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

