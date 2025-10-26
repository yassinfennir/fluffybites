import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// GET /api/products/[id] - Obtener un producto específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    const product = data.products.find((p: any) => p.id === params.id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error reading product:', error)
    return NextResponse.json(
      { error: 'Failed to load product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - Actualizar un producto
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    const index = data.products.findIndex((p: any) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Actualizar producto
    data.products[index] = {
      ...data.products[index],
      ...updates,
      id: params.id, // Asegurar que el ID no cambie
    }

    // Guardar archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json(data.products[index])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Eliminar un producto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    const index = data.products.findIndex((p: any) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Eliminar producto
    const [deletedProduct] = data.products.splice(index, 1)

    // Guardar archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json(deletedProduct)
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
