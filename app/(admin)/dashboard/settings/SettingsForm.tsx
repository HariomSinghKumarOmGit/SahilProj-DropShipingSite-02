"use client"

import { useState, useRef, useTransition } from "react"
import { Save, Upload, Image as ImageIcon, X } from "lucide-react"
import { updateSettingsAction } from "@/actions/settings"

type Props = {
  currentLogo: string | null
  currentBanner: string | null
}

export default function SettingsForm({ currentLogo, currentBanner }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (
    file: File | null,
    setPreview: (url: string | null) => void,
    setFile: (file: File | null) => void
  ) => {
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const clearPreview = (
    setPreview: (url: string | null) => void,
    setFile: (file: File | null) => void,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    setPreview(null)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData()
    if (logoFile) fd.append("logo", logoFile)
    if (bannerFile) fd.append("banner", bannerFile)

    startTransition(async () => {
      await updateSettingsAction(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  const inputClass =
    "w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none transition"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success banner */}
      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ Settings saved! Changes will be reflected across the site.
        </div>
      )}

      {/* ── Site Logo ────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <ImageIcon size={20} className="text-blue-600" /> Site Logo
        </h2>
        <p className="text-gray-500 text-xs mb-4">
          Upload your store logo. Recommended size: 400×100px (PNG with transparency).
          {currentLogo && (
            <span className="ml-1 text-blue-600 font-medium">
              • Current logo saved
            </span>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {/* Current / Preview */}
          <div className="w-48 h-16 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            ) : currentLogo ? (
              <img src={currentLogo} alt="Current logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No logo set</span>
            )}
          </div>

          {/* Upload + Clear buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="px-4 py-2 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm font-medium flex items-center gap-1.5"
            >
              <Upload size={16} /> Choose Logo
            </button>
            {logoPreview && (
              <button
                type="button"
                onClick={() => clearPreview(setLogoPreview, setLogoFile, logoInputRef)}
                className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-1"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null, setLogoPreview, setLogoFile)}
        />
      </div>

      {/* ── Homepage Banner ──────────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Upload size={20} className="text-emerald-600" /> Homepage Banner
        </h2>
        <p className="text-gray-500 text-xs mb-4">
          Upload a hero banner image. Recommended size: 1600×520px.
          {currentBanner && (
            <span className="ml-1 text-emerald-600 font-medium">
              • Current banner saved
            </span>
          )}
        </p>

        <div className="space-y-4">
          {/* Preview */}
          <div className="w-full aspect-3/1 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
            ) : currentBanner ? (
              <img src={currentBanner} alt="Current banner" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm text-gray-400">No banner set — the default rotating slides will be shown</span>
            )}
          </div>

          {/* Upload + Clear buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="px-4 py-2 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition text-sm font-medium flex items-center gap-1.5"
            >
              <Upload size={16} /> Choose Banner
            </button>
            {bannerPreview && (
              <button
                type="button"
                onClick={() => clearPreview(setBannerPreview, setBannerFile, bannerInputRef)}
                className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center gap-1"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null, setBannerPreview, setBannerFile)}
        />
      </div>

      {/* ── Save Button ──────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || (!logoFile && !bannerFile)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
        >
          <Save size={18} />
          {isPending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  )
}
