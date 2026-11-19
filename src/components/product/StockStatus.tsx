import type { Product } from '@/data/products'

export function StockStatus({ product }: { product: Product }) {
  const [text, dot] = product.stock === 'out' ? ['Out of stock', 'bg-error'] : ['In stock', 'bg-success']
  return (
    <p className="flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" /> {text}
    </p>
  )
}
