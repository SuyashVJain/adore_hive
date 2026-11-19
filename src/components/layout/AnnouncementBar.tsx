import { Heart } from 'lucide-react'
import { site } from '@/config/site'

export function AnnouncementBar() {
  return (
    <div role="region" aria-label="Announcement" className="flex min-h-8 items-center justify-center bg-rose px-4 py-1.5 text-center text-xs text-ink">
      <span>
        <span className="min-[460px]:hidden">{site.announcementShort}</span>
        <span className="hidden min-[460px]:inline">{site.announcement}</span>{' '}
        <Heart className="inline h-3 w-3 align-[-1px]" aria-hidden="true" />
      </span>
    </div>
  )
}
