import { Link } from 'react-router-dom'
import { images } from '@/data/images'

export function Logo({ className = 'h-16 lg:h-[88px]' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Adore Hive, home" className="inline-flex shrink-0 items-center">
      <img src={images.logo} alt="" width={303} height={271} className={`w-auto shrink-0 max-w-none ${className}`} />
    </Link>
  )
}
