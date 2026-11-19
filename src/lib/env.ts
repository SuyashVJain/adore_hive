// Typed access to build-time flags. See .env.example and the README for what each one does.
const on = (v: string | undefined) => v === 'true' || v === '1'

export const env = {
  /** Show the sample (placeholder) customer reviews. Keep off until real, approved reviews exist. */
  showSampleReviews: on(import.meta.env.VITE_SHOW_SAMPLE_REVIEWS),
  /** Let search engines index the site. Off by default so a staging or pre-launch deploy stays private. */
  indexable: on(import.meta.env.VITE_INDEXABLE),
  /** Public origin used for canonical and social URLs. Falls back to the current origin. */
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, ''),
}
