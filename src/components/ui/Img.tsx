import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'

/** Image with a shimmering blush placeholder until it has loaded (or failed). Requires alt, width and height. */
export function Img({ className = '', alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { alt: string; width: number; height: number }) {
  const ref = useRef<HTMLImageElement>(null)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (ref.current?.complete) setDone(true)
  }, [])
  return <img ref={ref} alt={alt} {...rest} onLoad={() => setDone(true)} onError={() => setDone(true)} className={`${className} ${done ? '' : 'skeleton'}`} />
}
