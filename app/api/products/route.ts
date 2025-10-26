import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic' // Deshabilita cache estático

// GET /api/products - Obtener todos los productos
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Añadir nuevo producto
export async function POST(request: Request) {
  try {
    const newProduct = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    // Generar ID único
    const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const productWithId = {
      id,
      ...newProduct,
    }

    data.products.push(productWithId)

    // Guardar archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json(productWithId, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
