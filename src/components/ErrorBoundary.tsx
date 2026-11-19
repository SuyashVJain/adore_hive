import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State { failed: boolean }

/** Last line of defence: a calm page instead of a blank screen if something throws while rendering. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="grid min-h-screen place-items-center bg-page px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-5xl">Something went a little sideways.</h1>
          <p className="mt-4 text-muted">Sorry about that. Your bag and wishlist are safe. Try reloading the page, or head back to the start.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-[46px] items-center justify-center rounded bg-ink px-6 font-label text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#3a3030]">Reload the page</button>
            <a href="/" className="inline-flex min-h-[46px] items-center justify-center rounded border border-ink px-6 font-label text-xs font-semibold uppercase tracking-[0.14em] hover:bg-blush">Back to home</a>
          </div>
        </div>
      </main>
    )
  }
}
