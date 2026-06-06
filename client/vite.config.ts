import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { UserConfig as ViteUserConfig } from 'vite'
import type { InlineConfig as VitestInlineConfig } from 'vitest'

interface UserConfig extends ViteUserConfig {
  test?: VitestInlineConfig
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
} as UserConfig)
