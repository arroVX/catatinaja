import { useEffect, useState } from 'react'
import {
  ArrowCounterClockwise,
  Bell,
  CaretRight,
  Cloud,
  DeviceMobile,
  DownloadSimple,
  MoonStars,
  PencilSimple,
  Sun,
} from '@phosphor-icons/react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'
import { Segmented } from '../components/ui/Segmented'
import { Sheet } from '../components/ui/Sheet'
import { Switch } from '../components/ui/Switch'
import { useToast } from '../components/ui/ToastProvider'
import type { ThemeMode } from '../types'

export function SettingsPage() {
  const { profile, updateProfile, exportData, resetDemo } = useApp()
  const { toast } = useToast()
  const [profileOpen, setProfileOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)

  useEffect(() => {
    if (!profileOpen) return
    setName(profile.name)
    setEmail(profile.email)
  }, [profileOpen, profile.name, profile.email])

  const saveProfile = () => {
    if (!name.trim()) return
    updateProfile({ name: name.trim(), email: email.trim() })
    setProfileOpen(false)
    toast('Profil diperbarui', 'success')
  }

  const handleExport = () => {
    exportData()
    toast('Backup JSON diunduh', 'success')
  }

  const handleReset = () => {
    resetDemo()
    setResetOpen(false)
    toast('Data demo dimuat ulang', 'success')
  }

  return (
    <div>
      <PageHeader
        title="Pengaturan"
        subtitle="Profil, tampilan, dan data aplikasimu."
        back
      />

      <div className="space-y-4 px-4">
        <section className="rounded-[30px] bg-hero p-5 text-hero-ink">
          <div className="flex items-start gap-4">
            <Avatar
              name={profile.name}
              size="lg"
              className="bg-hero-ink text-hero"
            />
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="truncate text-[18px] font-bold leading-tight tracking-[-0.035em]">
                {profile.name}
              </p>
              <p className="mt-1 truncate text-[11px] font-medium text-hero-muted">
                {profile.email}
              </p>
              <span className="mt-2 inline-flex items-center rounded-full border border-hero-line px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em]">
                Mode demo
              </span>
            </div>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Ubah profil"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-hero-soft text-hero-ink transition-colors hover:bg-hero-line"
            >
              <PencilSimple size={17} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-4 border-t border-hero-line pt-3 text-[10px] leading-relaxed text-hero-muted">
            Data tersimpan di perangkat ini. Sinkronisasi Firebase akan ditambahkan pada tahap
            berikutnya.
          </p>
        </section>

        <section className="rounded-[30px] bg-surface p-5">
          <p className="type-eyebrow">Tampilan</p>
          <h2 className="type-title mt-1 text-[18px] text-ink">Tema aplikasi</h2>
          <div className="mt-3">
            <Segmented<ThemeMode>
              label="Tema aplikasi"
              value={profile.theme}
              onChange={(theme) => updateProfile({ theme })}
              options={[
                { value: 'light', label: 'Terang', icon: <Sun size={14} aria-hidden="true" /> },
                { value: 'dark', label: 'Gelap', icon: <MoonStars size={14} aria-hidden="true" /> },
                {
                  value: 'system',
                  label: 'Sistem',
                  icon: <DeviceMobile size={14} aria-hidden="true" />,
                },
              ]}
            />
          </div>
          <p className="mt-2.5 text-[10px] font-medium text-muted">
            Tema gelap nyaman untuk penggunaan malam hari.
          </p>
        </section>

        <section className="overflow-hidden rounded-[30px] bg-surface">
          <div className="px-5 pb-1 pt-5">
            <p className="type-eyebrow">Pengingat</p>
            <h2 className="type-title mt-1 text-[18px] text-ink">Ingatkan aku</h2>
          </div>
          <div className="mt-2 flex items-center gap-3 px-5 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
              <Bell size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-ink">Pengingat harian</p>
              <p className="text-[10px] font-medium text-muted">Ingatkan aku mengisi catatan</p>
            </div>
            <Switch
              checked={profile.reminderEnabled}
              onChange={(reminderEnabled) => updateProfile({ reminderEnabled })}
              label="Aktifkan pengingat harian"
            />
          </div>
          {profile.reminderEnabled && (
            <div className="flex items-center gap-3 border-t border-line/60 px-5 py-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
                <Bell size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-ink">Jam pengingat</p>
                <p className="text-[10px] font-medium text-muted">Saat aplikasi terbuka</p>
              </div>
              <input
                type="time"
                value={profile.reminderTime}
                onChange={(event) => updateProfile({ reminderTime: event.target.value })}
                aria-label="Jam pengingat harian"
                className="min-h-11 rounded-full border border-line bg-surface px-3 text-[12px] font-semibold text-ink"
              />
            </div>
          )}
          <p className="border-t border-line/60 px-5 py-3 text-[9.5px] leading-relaxed text-muted">
            Notifikasi saat aplikasi tertutup membutuhkan push notification dan akan hadir pada
            versi berikutnya.
          </p>
        </section>

        <section className="overflow-hidden rounded-[30px] bg-surface">
          <div className="px-5 pb-2 pt-5">
            <p className="type-eyebrow">Data</p>
            <h2 className="type-title mt-1 text-[18px] text-ink">Cadangan & pemulihan</h2>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex min-h-[64px] w-full items-center gap-3 border-t border-line/60 px-5 py-3.5 text-left transition-colors active:bg-surface-2"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
              <DownloadSimple size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-ink">Export data</p>
              <p className="text-[10px] font-medium text-muted">Unduh backup dalam format JSON</p>
            </div>
            <CaretRight size={15} className="text-muted" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="flex min-h-[64px] w-full items-center gap-3 border-t border-line/60 px-5 py-3.5 text-left transition-colors active:bg-surface-2"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
              <ArrowCounterClockwise size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-ink">Muat ulang data demo</p>
              <p className="text-[10px] font-medium text-muted">Kembalikan contoh data awal</p>
            </div>
            <CaretRight size={15} className="text-muted" aria-hidden="true" />
          </button>
          <div className="flex min-h-[64px] w-full items-center gap-3 border-t border-line/60 px-5 py-3.5 opacity-60">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
              <Cloud size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-ink">Sinkronisasi cloud</p>
              <p className="text-[10px] font-medium text-muted">Firebase · segera hadir</p>
            </div>
            <span className="rounded-full border border-line px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
              Segera
            </span>
          </div>
        </section>

        <section className="rounded-[30px] bg-surface p-5">
          <p className="type-eyebrow">Tentang</p>
          <h2 className="type-title mt-1 text-[18px] text-ink">Harian</h2>
          <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
            Harian membantumu mencatat keuangan, tugas, agenda, dan kebiasaan dalam satu
            tempat. Dibangun dengan React, Vite, dan Tailwind CSS.
          </p>
          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
            Versi 0.1.0 · Pratinjau UI
          </p>
        </section>

        <p className="px-2 pb-4 pt-1 text-center text-[9.5px] font-medium text-muted">
          Dibuat untuk rutinitas yang lebih tenang.
        </p>
      </div>

      <Sheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Ubah profil"
        description="Nama ini akan tampil di beranda."
        footer={
          <Button fullWidth size="lg" onClick={saveProfile} disabled={!name.trim()}>
            Simpan perubahan
          </Button>
        }
      >
        <div className="space-y-5 pb-1">
          <Field label="Nama" htmlFor="profile-name">
            <input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              className={inputClass}
            />
          </Field>
          <Field label="Email" hint="Opsional" htmlFor="profile-email">
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={80}
              className={inputClass}
            />
          </Field>
        </div>
      </Sheet>

      <Sheet
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Muat ulang data demo?"
        description="Semua catatan yang kamu buat akan diganti dengan contoh data awal. Tindakan ini tidak bisa dibatalkan."
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={() => setResetOpen(false)}
            >
              Batal
            </Button>
            <Button variant="danger" fullWidth size="lg" onClick={handleReset}>
              Muat ulang
            </Button>
          </div>
        }
      >
        <div className="rounded-[20px] bg-surface-2 p-4 text-[11px] leading-relaxed text-muted">
          Tips: gunakan <span className="font-semibold text-ink">Export data</span> terlebih
          dahulu jika ingin menyimpan catatanmu.
        </div>
      </Sheet>
    </div>
  )
}
