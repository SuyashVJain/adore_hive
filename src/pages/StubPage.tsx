import type { ReactNode } from 'react'
import { Breadcrumbs, Button, ProductCard, SectionHeading } from '@/components/ui'
import type { Crumb } from '@/components/ui/Breadcrumbs'
import type { Product } from '@/data/products'

interface Props {
  title: string
  eyebrow: string
  subtitle: string
  crumbs?: Crumb[]
  products?: Product[]
  cta?: { label: string; to: string }
  /** Decorative illustration above the heading */
  art?: ReactNode
  children?: ReactNode
}

/** Simple page shell: breadcrumbs, centred heading with intro copy, optional call to action and product grid. */
export function StubPage({ title, eyebrow, subtitle, crumbs, products, cta, art, children }: Props) {
  return (
    <div className="container-page py-6 md:py-10">
      {crumbs && <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...crumbs]} />}
      <div className="py-12 md:py-16">
        {art && <div className="mb-4 flex justify-center">{art}</div>}
        <SectionHeading as="h1" align="center" eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {cta && <div className="mt-8 flex justify-center"><Button to={cta.to}>{cta.label}</Button></div>}
      </div>
      {children}
      {products && products.length > 0 && (
        <>
        <h2 className="sr-only">Products</h2>
        <ul className="grid grid-cols-2 gap-3 pb-16 md:gap-5 lg:grid-cols-4">
          {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
        </>
      )}
    </div>
  )
}
