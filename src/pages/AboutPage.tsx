import { Heart, Sparkles } from 'lucide-react'
import { Breadcrumbs, Button, ExtLink } from '@/components/ui'
import { site } from '@/config/site'
import { useSeo } from '@/lib/useDocumentTitle'

const beliefs = [
  ['Self-expression', 'A favourite accessory can be a tiny reflection of you. Dress for a feeling, not a rule.'],
  ['Handmade love', 'We celebrate the texture, care and creativity that make handmade little treasures meaningful.'],
  ['Thoughtful gifting', 'The best gift feels personal. A colour, a note, a carefully chosen combination: the details tell the story.'],
]

export function AboutPage() {
  useSeo('About us and our story', 'Adore is the feeling. Hive is the little world around it. Meet the heart behind Adore Hive, a home for jewellery, handmade crochet and thoughtful gifting.')
  return (
    <div className="pb-16 pt-5 md:pt-6">
      <div className="container-page"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} /></div>

      <header className="container-page py-8 text-center md:py-12">
        <p className="eyebrow mb-3">The heart behind Adore Hive</p>
        <h1 className="mx-auto max-w-4xl text-[2.5rem] leading-tight md:text-6xl">More Than Accessories, It’s a Feeling.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">A little space for self-expression, thoughtful gifting and the joy of small, beautiful things.</p>
      </header>

      <div className="container-page">
        <img src="/images/about-hero.webp" alt="Hands tying a cream ribbon around a blush gift box on a wooden table" width={1280} height={510} className="aspect-[16/10] w-full rounded-xl object-cover md:aspect-[1280/510]" />
      </div>

      {/* Two-column text: heading left, copy right */}
      <section aria-labelledby="why-h" className="container-page grid gap-6 py-12 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow !text-ink mb-3">Why Adore Hive?</p>
          <h2 id="why-h" className="text-[2.25rem] leading-tight md:text-6xl">Adore is a feeling.<br />Hive is a belonging.</h2>
        </div>
        <div className="space-y-4 text-muted">
          <p>Adore is that quiet little feeling when something speaks to you. Hive is the warm, creative world around it, where small details, personal touches and thoughtful gestures come together.</p>
          <p>Our collection brings jewellery, hair accessories, handmade crochet and personalized gifting into one lovely place. Not just things to wear or give, but little ways to express who you are and what someone means to you.</p>
          <p className="flex items-center gap-2 font-display text-3xl italic text-ink">A little love in every detail. <Heart className="h-6 w-6" aria-hidden="true" /></p>
        </div>
      </section>

      {/* Beliefs band */}
      <section aria-labelledby="believe-h" className="container-page">
        <div className="rounded-xl bg-blush p-6 md:p-10">
          <h2 id="believe-h" className="eyebrow !text-ink">The little things we believe in</h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-3 md:gap-10">
            {beliefs.map(([t, d]) => (
              <li key={t}>
                <Sparkles className="h-6 w-6 text-[#8a6a1f]" aria-hidden="true" />
                <h3 className="mt-4 font-display text-3xl">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Image left, text right */}
      <section aria-labelledby="craft-h" className="container-page grid items-center gap-8 py-12 md:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <img src="/images/about-craft.webp" alt="Hands crocheting a small white daisy with a wooden hook" width={612} height={460} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover lg:aspect-[612/460]" />
        <div>
          <p className="eyebrow !text-ink mb-3">From a little idea to a lovely detail</p>
          <h2 id="craft-h" className="text-[2.25rem] leading-tight md:text-5xl">Creativity, made tangible.</h2>
          <p className="mt-4 text-muted">Soft yarn becomes a bloom. A simple ribbon becomes a finishing touch. A few favourite things become a gift that feels completely theirs.</p>
          <p className="mt-3 text-muted">Our handmade and customization collections invite you to be part of that creative process. Choose the occasion, mix the little treasures and add words that only you could write.</p>
          <Button to="/shop?finish=handmade" variant="outline" className="mt-6">Explore handmade with love</Button>
        </div>
      </section>

      {/* Layered: image right with an overlapping text card */}
      <section aria-labelledby="wrap-h" className="container-page">
        <div className="relative lg:grid lg:grid-cols-12 lg:items-center">
          <img src="/images/about-gifts.webp" alt="A stack of blush gift boxes tied with cream ribbon" width={604} height={452} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover lg:col-span-7 lg:col-start-6 lg:aspect-[604/520]" />
          <div className="relative mt-4 rounded-xl bg-surface p-6 shadow-sm md:p-10 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:-mr-12 lg:mt-0">
            <p className="eyebrow !text-ink mb-3">The joy of opening something lovely</p>
            <h2 id="wrap-h" className="text-[2rem] leading-tight md:text-5xl">Wrapped with thought. Finished with you.</h2>
            <p className="mt-4 text-muted">Beautiful packaging is part of the feeling. Blush tones, soft ribbons and carefully chosen details set the scene for the personal touches inside.</p>
            <p className="mt-3 text-muted">A recipient’s name. A handwritten message. A little surprise tucked between favourite things. This is gifting with a little more heart.</p>
            <Button to="/hamper-studio" className="mt-6">Create your personalized gift</Button>
          </div>
        </div>
      </section>

      {/* Founder: only rendered once the owner has supplied her note */}
      {site.founder.note.trim() && (
        <section aria-labelledby="founder-h" className="container-page grid items-center gap-8 py-12 md:py-16 lg:grid-cols-[360px_1fr] lg:gap-16">
          <img src={site.founder.photo} alt={`${site.founder.name}, ${site.founder.role} of ${site.name}`} width={360} height={450} loading="lazy" className="mx-auto aspect-[4/5] w-full max-w-[360px] rounded-xl object-cover" />
          <div>
            <p className="eyebrow !text-ink mb-3">{site.founder.role}</p>
            <h2 id="founder-h" className="text-[2rem] leading-tight md:text-5xl">{site.founder.name}</h2>
            <div className="mt-4 space-y-3 text-muted">{site.founder.note.trim().split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
            {site.founder.instagram && <p className="mt-4 text-sm"><ExtLink href={`https://www.instagram.com/${site.founder.instagram}`}>Instagram @{site.founder.instagram}</ExtLink></p>}
          </div>
        </section>
      )}

      {/* Closing call to action */}
      <section aria-labelledby="cta-h" className="container-page py-16 text-center md:py-24">
        <p className="eyebrow !text-ink mb-3">Buzz with style</p>
        <h2 id="cta-h" className="text-[2.25rem] leading-tight md:text-6xl">Find your little kind of lovely.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">For the everyday. For the special days. For you, and the people you adore.</p>
        <Button to="/shop" className="mt-8">Shop all</Button>
      </section>
    </div>
  )
}
