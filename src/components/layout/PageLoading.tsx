/** Calm placeholder while a route chunk loads; keeps the page height so the footer does not jump. */
export function PageLoading() {
  return (
    <div className="container-page grid min-h-screen place-items-center" role="status" aria-live="polite">
      <p className="font-display text-3xl text-muted">One moment…</p>
    </div>
  )
}
