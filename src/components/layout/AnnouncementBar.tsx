import { Heart } from 'lucide-react'
import { site } from '@/config/site'

export function AnnouncementBar() {
  return (
    <div role="region" aria-label="Announcement" className="bg-rose px-4 py-2 text-center text-xs text-ink">
      {site.announcement} <Heart className="inline h-3 w-3 align-[-1px]" aria-hidden="true" />
    </div>
  )
}
