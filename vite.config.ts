import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Fills the build-time tokens in index.html: the canonical site origin and the robots meta (only when not indexable). */
function htmlEnv(env: Record<string, string>): Plugin {
  const siteUrl = (env.SITE_URL || env.VITE_SITE_URL || 'https://adorehive.in').replace(/\/$/, '')
  const indexable = env.VITE_INDEXABLE === 'true' || env.VITE_INDEXABLE === '1'
  return {
    name: 'html-env',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replace(/%SITE_URL%/g, siteUrl)
          .replace('<!--ROBOTS-->', indexable ? '' : '<meta name="robots" content="noindex, nofollow" />'),
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), htmlEnv(env)],
    // Expose the public origin to the app too, without requiring a second variable
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(env.SITE_URL || env.VITE_SITE_URL || '') },
    build: { manifest: true },
    resolve: { alias: { '@': '/src' } },
  }
})
