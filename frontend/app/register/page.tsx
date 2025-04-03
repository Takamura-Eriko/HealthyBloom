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
import React from "react"

const registerSchema = z
  .object({
    name: z.string().min(2, {
      message: "名前は2文字以上である必要があります",
    }),
    email: z.string().email({
      message: "有効なメールアドレスを入力してください",
    }),
    password: z.string().min(8, {
      message: "パスワードは8文字以上である必要があります",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setIsLoading(true)

    try {
      await signUp(data.email, data.password, data.name)
      toast({
        title: "登録成功",
        description: "アカウントが正常に作成されました",
      })
      // router.push("/")
    } catch (error: any) {
      console.error("登録エラー:", error)

      let errorMessage = "アカウント作成に失敗しました"
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "このメールアドレスは既に使用されています"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "無効なメールアドレスです"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "パスワードが弱すぎます"
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
          <CardTitle className="text-2xl handwritten-heading">新規登録</CardTitle>
          <CardDescription>HealthyBloomのアカウントを作成してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お名前</FormLabel>
                    <FormControl>
                      <Input placeholder="山田 花子" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード（確認）</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            既にアカウントをお持ちの場合は
            <Link href="/login" className="text-primary hover:underline ml-1">
              ログイン
            </Link>
            してください
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

