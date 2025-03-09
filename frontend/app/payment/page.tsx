"use client"

import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"
import PaymentForm from "@/components/PaymentForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>プレミアムプラン決済</CardTitle>
          <CardDescription>
            プレミアムプランに登録して、より多くの機能をお楽しみください。
            <br />
            <span className="text-sm text-muted-foreground">
              注: これはプレビューモードです。実際の決済は行われません。
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  )
}

