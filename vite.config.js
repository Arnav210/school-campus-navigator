import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

function offlineWorker() {
  return {
    name: 'offline-worker',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const template = readFileSync(new URL('./src/service-worker.js', import.meta.url), 'utf8')
      const files = Object.keys(bundle).sort()
      const publicFiles = ['manifest.json', 'favicon.svg', 'icon-192.png', 'icon-512.png']
      const hash = createHash('sha256')
        .update(template)
        .update(JSON.stringify(files))
        .update(String(bundle['index.html'].source))
      for (const file of publicFiles) {
        hash.update(readFileSync(new URL(`./public/${file}`, import.meta.url)))
      }
      const version = hash.digest('hex').slice(0, 16)
      const urls = [...files, ...publicFiles]
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replaceAll('__CACHE_VERSION__', JSON.stringify(version))
          .replaceAll('__PRECACHE_URLS__', JSON.stringify(urls)),
      })
    },
  }
}

// https://vitejs.dev
export default defineConfig({
  plugins: [react(), offlineWorker()],
  base: '/school-campus-navigator/',
})
