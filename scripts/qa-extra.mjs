import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const out = 'C:/Users/TKJ_07/AppData/Local/Temp/opencode/harian-shots'
const base = 'http://127.0.0.1:5173'
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

await mkdir(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu', '--no-first-run'],
})

const page = await browser.newPage()
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function visit(route, viewport = { width: 390, height: 844 }) {
  await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await wait(300)
}

async function shotSheet(route, pickText, name) {
  await visit(route)
  const clicked = await page.evaluate((text) => {
    const target = [...document.querySelectorAll('button')].find((element) =>
      element.textContent?.includes(text),
    )
    target?.click()
    return Boolean(target)
  }, pickText)
  if (!clicked) throw new Error(`Baris "${pickText}" tidak ditemukan di ${route}`)
  await wait(450)
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log('saved', name)
}

async function clickAria(route, selector, name) {
  await visit(route)
  await page.click(selector)
  await wait(450)
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log('saved', name)
}

const routes = ['/', '/keuangan', '/tugas', '/kalender', '/kebiasaan', '/pengaturan']

let failures = 0
function check(condition, label) {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${label}`)
  if (!condition) failures += 1
}

try {
  await shotSheet('/keuangan', 'Kopi & roti', '20-transaction-detail')
  await clickAria('/tugas', '[aria-label^="Aksi untuk tugas"]', '21-task-actions')
  await clickAria('/kebiasaan', '[aria-label^="Aksi untuk kebiasaan"]', '22-habit-actions')

  for (const route of routes) {
    await visit(route, { width: 360, height: 800 })
    const geometry = await page.evaluate(() => {
      const doc = document.documentElement
      const offenders = []
      for (const element of document.querySelectorAll('body *')) {
        const rect = element.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        if (rect.right <= window.innerWidth + 0.5 && rect.left >= -0.5) continue
        let parent = element.parentElement
        let scrollable = false
        while (parent) {
          const overflowX = getComputedStyle(parent).overflowX
          if (overflowX === 'auto' || overflowX === 'scroll') {
            scrollable = true
            break
          }
          parent = parent.parentElement
        }
        if (scrollable) continue
        offenders.push(`${element.tagName.toLowerCase()}.${String(element.className).slice(0, 40)}`)
      }
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        offenders: offenders.slice(0, 4),
      }
    })
    check(
      geometry.scrollWidth <= geometry.clientWidth,
      `Tidak ada overflow horizontal di ${route} (${geometry.scrollWidth}/${geometry.clientWidth})`,
    )
    if (geometry.offenders.length > 0) {
      console.log(`      elemen keluar layar: ${geometry.offenders.join(' | ')}`)
    }
  }

  await visit('/tugas', { width: 360, height: 900 })
  await page.screenshot({ path: `${out}/23-tasks-360.png` })
  console.log('saved 23-tasks-360')

  await visit('/keuangan', { width: 360, height: 900 })
  await page.screenshot({ path: `${out}/24-finance-360.png` })
  console.log('saved 24-finance-360')

  await visit('/kebiasaan', { width: 360, height: 900 })
  await page.screenshot({ path: `${out}/25-habits-360.png` })
  console.log('saved 25-habits-360')

  await visit('/pengaturan', { width: 360, height: 900 })
  await page.screenshot({ path: `${out}/26-settings-360.png` })
  console.log('saved 26-settings-360')

  await visit('/pengaturan')
  const smallTargets = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('button, a, [role="switch"]')]
    return nodes
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0 && (rect.width < 36 || rect.height < 36)
      })
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return `${element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 24)} (${Math.round(rect.width)}x${Math.round(rect.height)})`
      })
  })
  check(smallTargets.length === 0, 'Tidak ada target sentuh di bawah 36px')
  if (smallTargets.length > 0) console.log(`      ${smallTargets.join(' | ')}`)

  console.log(failures === 0 ? 'QA EKSTRA LULUS' : `${failures} PEMERIKSAAN GAGAL`)
  process.exitCode = failures === 0 ? 0 : 1
} finally {
  await browser.close()
}
