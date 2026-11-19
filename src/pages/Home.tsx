import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { Heart, Sparkles, Star } from 'lucide-react'
import { Button, ExtLink, ProductCard, SectionHeading } from '@/components/ui'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/config/site'
import { images } from '@/data/images'
import { categories, getProduct, homeRows } from '@/data/products'
import { reviews } from '@/data/reviews'
import { fadeUp, stagger } from '@/lib/motion'
import { useSeo } from '@/lib/useDocumentTitle'

const trust = ['Thoughtfully curated', 'Handmade with love', 'Personal touches', 'Beautifully wrapped']
const categoryImage = {
  jewellery: images.products['pearl-whisper-earrings'],
  'hair-accessories': images.products['blush-satin-bow'],
  'handmade-crochet': images.products['little-daisy-bouquet'],
  'customized-gifting': images.products['little-love-hamper'],
} as const

function Hero() {
  return (
    <section aria-labelledby="hero-h" className="relative overflow-hidden bg-hero">
      <img src={images.hero} alt="" width={772} height={610} {...{ fetchpriority: 'high' }} className="absolute inset-0 h-full w-full object-cover lg:left-[40.6%] lg:w-[59.4%]" />
      <div className="container-page relative py-8 md:py-16 lg:py-[110px]">
        {/* Everything sits inside this panel, at every width */}
        <m.div className="max-w-[600px] rounded-xl bg-page p-6 shadow-sm md:p-10" variants={stagger()} initial="hidden" animate="show">
          <m.p variants={fadeUp} className="eyebrow !text-ink">A little adore. A little every day.</m.p>
          <m.h1 variants={fadeUp} id="hero-h" className="mt-4 text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem]">A Little Love in Every Detail.</m.h1>
          <m.p variants={fadeUp} className="mt-5 text-base text-muted md:text-lg">Discover thoughtfully curated accessories, handmade treasures and personalized gifts.</m.p>
          <m.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button to="/shop">Shop collection</Button>
            <Button to="/hamper-studio" variant="outline">Create your own hamper</Button>
          </m.div>
          <m.p variants={fadeUp} className="mt-7 flex items-center gap-2 font-display text-2xl italic">For you. For them. From the heart. <Heart className="h-5 w-5" aria-hidden="true" /></m.p>
        </m.div>
      </div>
    </section>
  )
}

function TrustStrip() {
  return (
    <section aria-label="Why Adore Hive" className="bg-surface">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-3 py-5 md:grid-cols-4">
        {trust.map((t) => (
          <li key={t} className="flex items-center justify-start gap-2 text-sm text-ink md:justify-center">
            <Sparkles className="h-4 w-4 shrink-0 text-eyebrow" aria-hidden="true" /> {t}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Categories() {
  return (
    <Reveal as="section" labelledBy="cat-h" className="container-page py-10 md:py-20">
      <p className="eyebrow !text-ink mb-3">Find your little lovely</p>
      <h2 id="cat-h" className="text-[2rem] md:text-5xl">Something to adore.</h2>
      <p className="mt-3 text-muted">Everyday favourites. Unexpected little joys.</p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-10 md:grid-cols-4 md:gap-x-6">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link to={`/shop/${c.slug}`} className="group block text-center">
              <span className="block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2.5rem] bg-blush">
                <Img src={categoryImage[c.slug]} alt="" width={222} height={246} loading="lazy" className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:motion-safe:scale-105" />
              </span>
              <span className="mt-4 block font-display text-2xl group-hover:underline underline-offset-4 md:text-3xl">{c.label}</span>
              <span className="eyebrow mt-1 block !text-ink">Shop now</span>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function Row({ title, subtitle, ids, to }: { title: string; subtitle: string; ids: readonly string[]; to: string }) {
  const items = ids.flatMap((i) => getProduct(i) ?? [])
  return (
    <Reveal as="section" label={title} className="container-page py-5 md:py-10">
      <SectionHeading eyebrow="The Adore edit" title={title} subtitle={subtitle} action={{ label: 'View all', to }} />
      {/* Mobile: snap carousel showing ~1.6 cards. Tablet: 3 columns. Desktop: 4. */}
      <ul
        tabIndex={0}
        aria-label={`${title}, scrollable list`}
        className="carousel -mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p, i) => (
          <li key={p.id} className={`w-[62%] shrink-0 snap-start sm:w-[44%] md:w-auto ${i === 3 ? 'md:max-lg:hidden' : ''}`}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function Gifting() {
  return (
    <Reveal as="section" labelledBy="gift-h" className="bg-blush py-10 md:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Img src={images.lifestyle.hamper} alt="" width={560} height={460} loading="lazy" className="aspect-[16/10] w-full rounded-t-[3rem] md:aspect-[560/460] rounded-b-[5rem] object-cover lg:rounded-b-[8rem]" />
        <div>
          <p className="eyebrow !text-ink mb-3">A gift that could only be from you</p>
          <h2 id="gift-h" className="text-[2rem] md:text-5xl">Made Especially for You</h2>
          <p className="mt-4 text-muted">A favourite colour. A little inside joke. A note that says it all. Put your heart into a gift that feels beautifully personal.</p>
          <ul className="mt-6 space-y-2 text-sm">
            {['Build a hamper, little treasure by little treasure', 'Turn your words into a handwritten keepsake', 'Add personal touches to a thoughtful gift'].map((t) => (
              <li key={t} className="flex items-center gap-2"><Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" /> {t}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button to="/hamper-studio">Create your own hamper</Button>
            <Button to="/letter-studio" variant="outline">Write a little love letter</Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 text-xs">
            {[['Personalized hampers', '/shop/customized-gifting?type=personalized-hampers'], ['Handwritten letters', '/shop/customized-gifting?type=handwritten-letters'], ['Personalized gifts', '/shop/customized-gifting']].map(([l, to]) => (
              <li key={to}><Link to={to} className="eyebrow inline-flex min-h-11 items-center !text-ink hover:underline underline-offset-4">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}

function Story() {
  return (
    <Reveal as="section" labelledBy="story-h" className="container-page grid items-center gap-10 py-10 md:py-20 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="eyebrow !text-ink mb-3">The heart behind the hive</p>
        <h2 id="story-h" className="text-[2rem] md:text-5xl">More Than Accessories, It’s a Feeling.</h2>
        <p className="mt-5 text-muted">Adore is the feeling. Hive is the little world we build around it, full of creativity, connection and beautiful things that bring us together.</p>
        <p className="mt-4 text-muted">We believe self-expression lives in the details: a bow in your hair, a handmade bloom on your desk, a gift chosen just for someone. Thoughtful packaging and personal touches make those small moments feel special.</p>
        <Button to="/about" variant="outline" className="mt-7">Explore our story</Button>
      </div>
      <Img src={images.lifestyle.wrapping} alt="" width={608} height={470} loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover md:aspect-[608/470]" />
    </Reveal>
  )
}

function Reviews() {
  return (
    <Reveal as="section" labelledBy="rev-h" className="bg-panel py-10 md:py-20">
      <div className="container-page">
        <p className="eyebrow !text-ink mb-3">Your words, our little joy</p>
        <h2 id="rev-h" className="text-[2rem] md:text-5xl">A Little Love From Our Customers.</h2>
        <ul tabIndex={0} aria-label="Customer reviews, scrollable list" className="carousel -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {reviews.map((r) => (
            <li key={r.id} className="w-[84%] shrink-0 snap-start sm:w-[60%] md:w-auto">
              <figure className="h-full rounded-lg bg-surface p-6">
                <Img src={r.avatar} alt="" width={64} height={64} loading="lazy" className="h-16 w-16 rounded-full object-cover" />
                <p className="mt-4 flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-ink" aria-hidden="true" />)}
                </p>
                <h3 className="mt-3 font-product text-xl">{r.title}</h3>
                <blockquote className="mt-2 text-muted">{r.body}</blockquote>
                <figcaption className="mt-4 text-sm text-muted">{r.name} · {r.product}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

function Instagram() {
  return (
    <Reveal as="section" labelledBy="ig-h" className="container-page py-10 md:py-20">
      <p className="eyebrow !text-ink mb-3">The little moments, too</p>
      <h2 id="ig-h" className="text-[2rem] md:text-5xl">Find Your Daily Dose of Adore.</h2>
      <p className="mt-3 text-muted">Styling notes, handmade moments and lovely things in the making.</p>
      <ul tabIndex={0} aria-label="Instagram photos, scrollable list" className="carousel -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {images.instagram.map((src, i) => (
          <li key={src} className="w-[58%] shrink-0 snap-start sm:w-[36%] md:w-auto">
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Adore Hive on Instagram, photo ${i + 1} (opens in a new tab)`} className="block overflow-hidden rounded-lg">
              <Img src={src} alt="" width={311} height={280} loading="lazy" className="aspect-[311/280] w-full object-cover motion-safe:transition-transform motion-safe:duration-500 hover:motion-safe:scale-105" />
            </a>
          </li>
        ))}
      </ul>
      <Button href={site.instagramUrl} variant="outline" className="mt-8">Follow us on Instagram</Button>
      <p className="mt-3 text-sm text-muted"><ExtLink href={site.instagramUrl}>{site.instagramHandle}</ExtLink></p>
    </Reveal>
  )
}

export function Home() {
  useSeo('Thoughtful accessories, handmade crochet and gifts', 'Discover thoughtfully curated jewellery, hair accessories, handmade crochet and personalized gifts from Adore Hive. A little love in every detail.')
  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories />
      <Row title="Best Sellers" subtitle="The little things you keep coming back to." ids={homeRows.bestSellers} to="/shop" />
      <Row title="New Arrivals" subtitle="Fresh finds for a little everyday magic." ids={homeRows.newArrivals} to="/shop?sort=newest" />
      <Row title="Handmade With Love" subtitle="A little time, a little craft, a lot of heart." ids={homeRows.handmade} to="/shop?finish=handmade" />
      <div className="h-4 md:h-12" />
      <Gifting />
      <Story />
      <Reviews />
      <Instagram />
    </>
  )
}
