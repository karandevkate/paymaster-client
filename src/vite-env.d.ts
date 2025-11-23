// vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Define all your VITE variables here.
    // VITE_API_BASE_URL is the critical one causing the error.
    readonly VITE_API_BASE_URL: string
    // If you use other VITE variables, add them too (e.g., VITE_APP_TITLE: string)
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}