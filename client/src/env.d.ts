/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_RESOURCE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
