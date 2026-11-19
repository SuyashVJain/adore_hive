import { Link } from 'react-router-dom'
import { images } from '@/data/images'

export function Logo({ className = 'h-16 lg:h-[88px]' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Adore Hive, home" className="inline-flex shrink-0 items-center">
      <img src={images.logo} alt="" className={`w-auto ${className}`} />
    </Link>
  )
}
