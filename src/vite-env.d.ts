/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEFAULT_ZONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}