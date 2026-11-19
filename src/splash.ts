// Dismisses the loading screen that index.html shows once per session.
// Waits at least ~900ms and until fonts and the home hero image are ready, but never longer than ~2.5s.
const el = document.getElementById('splash')

if (el && document.documentElement.classList.contains('splash')) {
  const MIN = 900
  const CAP = 2500
  const left = (ms: number) => new Promise<void>((r) => setTimeout(r, Math.max(0, ms - performance.now())))

  const fontsReady = new Promise<void>((resolve) => {
    const link = document.querySelector<HTMLLinkElement>('link[href*="fonts.googleapis"]')
    const loadFonts = () =>
      Promise.all([document.fonts.load('400 16px Poppins'), document.fonts.load('400 40px "Cormorant Garamond"')]).then(() => resolve(), () => resolve())
    if (!link || link.media === 'all') loadFonts()
    else link.addEventListener('load', loadFonts, { once: true })
  })

  const hero = new Promise<void>((resolve) => {
    if (location.pathname !== '/') return resolve()
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = '/images/hero.webp'
  })

  Promise.all([left(MIN), Promise.race([Promise.all([fontsReady, hero]), left(CAP)])]).then(() => {
    el.setAttribute('aria-busy', 'false')
    el.classList.add('done')
    setTimeout(() => {
      el.remove()
      document.documentElement.classList.remove('splash')
      try { sessionStorage.setItem('ah-splash', '1') } catch { /* private mode: the screen may show again, which is harmless */ }
    }, 550)
  })
}

export {}
