import { nanoid } from '@reduxjs/toolkit'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(request: Request) {
  const { amount } = await request.json()
  const currency = 'INR'

  const options = {
    amount: amount * 100,
    currency,
    receipt: nanoid(10)
  }

  const order = await razorpay.orders.create(options)
  return NextResponse.json({ orderId: order.id, ...options }, { status: 200 })
}
