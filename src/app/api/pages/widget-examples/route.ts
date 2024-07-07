// Next Imports
import { NextResponse } from 'next/server'

// Data Imports
import { db } from '@/fake-db/pages/widget-examples'

export async function GET() {
  return NextResponse.json(db)
}
