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

async function visit(route, viewport = { width: 390, height: 2000 }) {
  await page.setViewport({ ...viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await wait(350)
}

async function shot(route, name, viewport) {
  await visit(route, viewport)
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log('saved', name)
}

async function shotSheet(route, trigger, name, viewport = { width: 390, height: 844 }) {
  await visit(route, viewport)
  await page.click(trigger)
  await wait(400)
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log('saved', name)
}

try {
  await shot('/', '01-home-light')
  await shot('/keuangan', '02-finance-light')
  await shot('/tugas', '03-tasks-light')
  await shot('/kalender', '04-calendar-light')
  await shot('/kebiasaan', '05-habits-light')
  await shot('/pengaturan', '06-settings-light')
  await shot('/', '07-home-360', { width: 360, height: 2000 })

  await shotSheet('/keuangan', '[aria-label="Catat transaksi baru"]', '08-finance-sheet')
  await shotSheet('/tugas', '[aria-label="Tambah tugas baru"]', '09-task-sheet')
  await shotSheet('/kalender', '[aria-label="Tambah agenda baru"]', '10-event-sheet')
  await shotSheet('/kebiasaan', '[aria-label="Tambah kebiasaan baru"]', '11-habit-sheet')
  await shotSheet('/', '[aria-label="Tambah catatan cepat"]', '12-quickadd-sheet')

  await visit('/')
  await page.evaluate(() => {
    const key = 'harian.app.v1'
    const raw = localStorage.getItem(key)
    if (!raw) return
    const data = JSON.parse(raw)
    data.profile.theme = 'dark'
    localStorage.setItem(key, JSON.stringify(data))
  })
  await page.reload({ waitUntil: 'networkidle0' })
  await wait(300)

  await shot('/', '13-home-dark', { width: 390, height: 2000 })
  await shot('/keuangan', '14-finance-dark')
  await shot('/tugas', '15-tasks-dark')
  await shot('/kalender', '16-calendar-dark')
  await shot('/kebiasaan', '17-habits-dark')
  await shot('/pengaturan', '18-settings-dark')
  await shotSheet('/keuangan', '[aria-label="Catat transaksi baru"]', '19-finance-sheet-dark')

  await page.evaluate(() => {
    const key = 'harian.app.v1'
    const raw = localStorage.getItem(key)
    if (!raw) return
    const data = JSON.parse(raw)
    data.profile.theme = 'light'
    localStorage.setItem(key, JSON.stringify(data))
  })
} finally {
  await browser.close()
}
