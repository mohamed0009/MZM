import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export async function GET() {
  console.log('[Mock API] Requested all products')
  
  try {
    console.log(`[Mock API] Returning ${MOCK_PRODUCTS.length} products`)
    return NextResponse.json(MOCK_PRODUCTS, { status: 200 })
  } catch (error) {
    console.error('[Mock API] Error handling products request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 