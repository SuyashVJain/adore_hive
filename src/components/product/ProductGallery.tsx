import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ZoomIn } from 'lucide-react'
import { Img } from '../ui/Img'
import { Lightbox } from './Lightbox'

interface Props {
  images: string[]
  name: string
}

/** Desktop: main image + thumbnails. Mobile: swipeable scroll-snap track with dots. */
export function ProductGallery({ images, name }: Props) {
  const [i, setI] = useState(0)
  const [viewer, setViewer] = useState<number | null>(null)
  const track = useRef<HTMLUListElement>(null)

  const go = (n: number) => {
    const el = track.current
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    setI(n)
  }

  return (
    <div>
      {/* Mobile / small tablet */}
      <div className="relative md:hidden" role="region" aria-roledescription="carousel" aria-label={`${name} photos`}>
        <ul
          ref={track}
          data-fly-source
          tabIndex={0}
          aria-label="Swipe to see more photos"
          onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="carousel flex snap-x snap-mandatory overflow-x-auto rounded-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, n) => (
            <li key={src} className="w-full shrink-0 snap-center" aria-label={`Photo ${n + 1} of ${images.length}`}>
              <button type="button" onClick={() => setViewer(n)} aria-label={`Open photo ${n + 1} full screen`} className="block w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink">
                <Img src={src} alt={n === 0 ? name : `${name}, photo ${n + 1}`} width={610} height={620} loading={n === 0 ? 'eager' : 'lazy'} className="aspect-[16/10] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <div className="absolute inset-x-0 bottom-1 flex justify-center">
          <div className="flex rounded-full bg-white/80 px-1">
          {images.map((_, n) => (
            <button key={n} type="button" onClick={() => go(n)} aria-label={`Show photo ${n + 1}`} aria-current={i === n} className="grid h-11 w-8 place-items-center">
              <span className={`h-2 rounded-full transition-all ${i === n ? 'w-5 bg-ink' : 'w-2 bg-line-strong'}`} />
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <button type="button" onClick={() => setViewer(i)} aria-label="Open photo full screen, with zoom" className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2">
          <Img data-fly-source src={images[i] ?? images[0]} alt={name} width={610} height={620} className="aspect-[610/620] w-full object-cover" />
          <span aria-hidden="true" className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><ZoomIn className="h-5 w-5" /></span>
        </button>
        <ul className="mt-3 grid grid-cols-3 gap-3" aria-label="Photo thumbnails">
          {images.map((src, n) => (
            <li key={src}>
              <button type="button" onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`} aria-current={i === n} className={`block w-full overflow-hidden rounded-md border-2 transition-colors ${i === n ? 'border-ink' : 'border-transparent hover:border-line-strong'}`}>
                <Img src={src} alt="" width={195} height={135} loading="lazy" className="aspect-[195/135] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>
        {viewer !== null && <Lightbox key="lb" images={images} name={name} index={viewer} onIndex={setViewer} onClose={() => { setI(viewer); setViewer(null) }} />}
      </AnimatePresence>
    </div>
  )
}
