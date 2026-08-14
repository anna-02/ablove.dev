// Injects server-rendered markup into the built index.html so crawlers that
// don't execute JavaScript still see the page content.
import { readFile, writeFile, rm, copyFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = resolve(root, 'dist/index.html')

const { render } = await import(resolve(root, 'dist-server/entry-server.js'))
const html = render()

if (!html.trim()) {
  throw new Error('Prerender produced empty markup — refusing to write index.html')
}

const template = await readFile(indexPath, 'utf8')
const marker = '<div id="root"></div>'

if (!template.includes(marker)) {
  throw new Error(`Could not find ${marker} in dist/index.html`)
}

const output = template.replace(marker, `<div id="root">${html}</div>`)

await writeFile(indexPath, output)
// GitHub Pages serves 404.html for unknown paths; keep it identical to the app.
await writeFile(resolve(root, 'dist/404.html'), output)
await rm(resolve(root, 'dist-server'), { recursive: true, force: true })

// Keep /publications.bib downloadable. The file lives in src/ so it can be
// imported without Vite's public-directory warning, so it isn't copied for us.
await copyFile(
  resolve(root, 'src/data/publications.bib'),
  resolve(root, 'dist/publications.bib')
)

console.log(`Prerendered ${html.length} chars into dist/index.html and dist/404.html`)
