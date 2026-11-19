/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOW_SAMPLE_REVIEWS?: string
  readonly VITE_INDEXABLE?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
