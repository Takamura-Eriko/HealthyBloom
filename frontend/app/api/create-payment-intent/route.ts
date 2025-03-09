import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    // This is a mock implementation for preview purposes
    const clientSecret = "mock_client_secret_" + Math.random().toString(36).substring(2, 15)

    return NextResponse.json({ clientSecret })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

