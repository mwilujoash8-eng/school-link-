/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_THEME_BG?: string;
  readonly VITE_SPA_ROUTING?: string;
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
