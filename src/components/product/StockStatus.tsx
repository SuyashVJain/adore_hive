import type { Product } from '@/data/products'

export function StockStatus({ product }: { product: Product }) {
  const [text, dot] = {
    in: ['In stock', 'bg-success'],
    low: [`Only ${product.stockLeft ?? 'a few'} left`, 'bg-[#a15c00]'],
    out: ['Out of stock', 'bg-error'],
  }[product.stock]
  return (
    <p className="flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" /> {text}
    </p>
  )
}
