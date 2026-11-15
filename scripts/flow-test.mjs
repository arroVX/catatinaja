import puppeteer from 'puppeteer-core'

const base = 'http://127.0.0.1:5173'
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu', '--no-first-run'],
})

const page = await browser.newPage()
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const errors = []

page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`)
})
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

async function go(route) {
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await wait(250)
}

async function clickText(text, selector = 'button') {
  const clicked = await page.evaluate(
    (label, tag) => {
      const target = [...document.querySelectorAll(tag)].find((element) =>
        element.textContent?.trim().includes(label),
      )
      if (!target) return false
      target.click()
      return true
    },
    text,
    selector,
  )
  if (!clicked) throw new Error(`Tombol "${text}" tidak ditemukan`)
  await wait(450)
}

async function data() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('harian.app.v1') ?? 'null'))
}

let failures = 0
function check(condition, label) {
  if (condition) {
    console.log(`PASS  ${label}`)
  } else {
    failures += 1
    console.log(`FAIL  ${label}`)
  }
}

try {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })

  // 1. Tambah transaksi
  await go('/keuangan')
  await page.click('[aria-label="Catat transaksi baru"]')
  await wait(350)
  await page.type('#transaction-amount', '25000')
  await page.type('#transaction-note', 'Uji otomasi')
  await clickText('Simpan transaksi')
  const afterTransaction = await data()
  check(
    afterTransaction.transactions.some(
      (item) => item.amount === 25000 && item.note === 'Uji otomasi',
    ),
    'Transaksi baru tersimpan',
  )
  check(
    (await page.evaluate(() => document.body.innerText)).includes('Uji otomasi'),
    'Transaksi baru tampil di daftar',
  )

  // 2. Hapus transaksi lewat detail
  await page.evaluate(() => {
    const target = [...document.querySelectorAll('button')].find((element) =>
      element.textContent?.includes('Uji otomasi'),
    )
    target?.click()
  })
  await wait(400)
  await clickText('Hapus transaksi')
  const afterDelete = await data()
  check(
    !afterDelete.transactions.some((item) => item.note === 'Uji otomasi'),
    'Transaksi berhasil dihapus',
  )

  // 3. Tambah tugas
  await go('/tugas?new=1')
  await wait(450)
  await page.type('#task-title', 'Tugas uji otomasi')
  await clickText('Simpan tugas')
  const afterTask = await data()
  check(
    afterTask.tasks.some((item) => item.title === 'Tugas uji otomasi'),
    'Tugas baru tersimpan',
  )

  // 4. Tambah agenda
  await go('/kalender?new=1')
  await wait(450)
  await page.type('#event-title', 'Agenda uji otomasi')
  await clickText('Simpan agenda')
  const afterEvent = await data()
  check(
    afterEvent.events.some((item) => item.title === 'Agenda uji otomasi'),
    'Agenda baru tersimpan',
  )

  // 5. Tambah habit dan check-in
  await go('/kebiasaan?new=1')
  await wait(450)
  await page.type('#habit-name', 'Habit uji otomasi')
  await clickText('Simpan kebiasaan')
  const habit = (await data()).habits.find((item) => item.name === 'Habit uji otomasi')
  check(Boolean(habit), 'Kebiasaan baru tersimpan')

  if (habit) {
    await page.click('[aria-label="Tandai Habit uji otomasi selesai hari ini"]')
    await wait(450)
    const afterHabit = await data()
    check(
      afterHabit.habitLogs.some((log) => log.habitId === habit.id && log.done),
      'Check-in kebiasaan tersimpan',
    )
  }

  // 6. Theme switching
  await go('/pengaturan')
  await clickText('Gelap')
  check(
    await page.evaluate(() => document.documentElement.classList.contains('dark')),
    'Tema gelap aktif',
  )
  await clickText('Terang')
  check(
    await page.evaluate(() => !document.documentElement.classList.contains('dark')),
    'Tema terang aktif',
  )

  // 7. Persistensi setelah reload
  await page.reload({ waitUntil: 'networkidle0' })
  await wait(300)
  const persisted = await data()
  check(
    persisted.tasks.some((item) => item.title === 'Tugas uji otomasi'),
    'Data bertahan setelah reload',
  )

  console.log(errors.length === 0 ? 'PASS  Tidak ada error console' : `FAIL  Error console: ${errors.join(' | ')}`)
  if (errors.length > 0) failures += 1
  console.log(failures === 0 ? 'SEMUA TES LULUS' : `${failures} TES GAGAL`)
  process.exitCode = failures === 0 ? 0 : 1
} finally {
  await browser.close()
}
