"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "決済成功",
        description: "これはプレビューモードです。実際の決済は行われていません。",
      })
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "エラー",
        description: "決済処理中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          金額 (円)
        </label>
        <Input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="100"
          placeholder="1000"
        />
      </div>
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
          クレジットカード情報
        </label>
        <div className="mt-1 p-3 border rounded-md bg-gray-50">
          {/* This is a mock card element for preview */}
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "処理中..." : "決済する"}
      </Button>
    </form>
  )
}

