/// <reference types="vite/client" />

type ViteTypeOptions = object;

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string,
  readonly VITE_API_SECURE_URL: string,
  readonly VITE_DEFAULT_ZONE: string,
  readonly VITE_BEARER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
