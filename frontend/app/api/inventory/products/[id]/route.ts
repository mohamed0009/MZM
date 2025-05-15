import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  console.log(`[Mock API] Requested product ID: ${id}`)
  
  try {
    // Find the product in mock data
    const product = MOCK_PRODUCTS.find(p => p.id === id)
    
    if (product) {
      console.log(`[Mock API] Found product: ${product.name}`)
      return NextResponse.json(product, { status: 200 })
    } else {
      console.log(`[Mock API] Product not found with ID: ${id}`)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error(`[Mock API] Error handling product request:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 