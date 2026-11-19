import { Heart } from 'lucide-react'
import { site } from '@/config/site'

export function AnnouncementBar() {
  return (
    <div role="region" aria-label="Announcement" className="flex min-h-14 items-center justify-center bg-rose px-4 py-2 text-center text-xs text-ink min-[460px]:min-h-9">
      <span>{site.announcement} <Heart className="inline h-3 w-3 align-[-1px]" aria-hidden="true" /></span>
    </div>
  )
}
