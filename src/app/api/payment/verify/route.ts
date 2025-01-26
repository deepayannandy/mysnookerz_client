import crypto from 'crypto'
import { NextResponse } from 'next/server'

const generatedSignature = (razorpayOrderId: string, razorpayPaymentId: string): string => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    throw new Error('Razorpay key secret not found.')
  }
  const signature = crypto
    .createHmac('sha256', keySecret)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex')

  return signature
}

export async function POST(request: Request) {
  const { orderCreationId, razorpayPaymentId, razorpaySignature } = await request.json()

  const signature = generatedSignature(orderCreationId, razorpayPaymentId)

  if (signature !== razorpaySignature) {
    return NextResponse.json({ message: 'Payment verification failed', success: false }, { status: 400 })
  }
  return NextResponse.json({ message: 'Payment verified successfully', success: true }, { status: 200 })
}
