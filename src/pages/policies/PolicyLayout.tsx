import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/ui'
import { site } from '@/config/site'
import { useSeo } from '@/lib/useDocumentTitle'

export function PolicyLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  useSeo(title, intro)
  return (
    <div className="container-page pb-16 pt-5 md:pt-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
      <header className="py-8 md:py-12">
        <p className="eyebrow mb-3">Here to help</p>
        <h1 className="text-[2.5rem] leading-tight md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{intro}</p>
      </header>
      <div className="max-w-3xl space-y-8 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:mb-2 [&_p]:text-muted [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-muted [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4">
        {children}
        <section>
          <h2>Questions?</h2>
          <p>
            Call {site.phoneDisplay} or message us on <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
            {site.email ? <> You can also write to <a href={`mailto:${site.email}`}>{site.email}</a>.</> : null}
          </p>
        </section>
      </div>
    </div>
  )
}
