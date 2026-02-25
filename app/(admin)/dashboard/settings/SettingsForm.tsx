"use client"

import { useState, useRef, useTransition } from "react"
import { Save, Upload, Image as ImageIcon, X } from "lucide-react"
import { updateSettingsAction } from "@/actions/settings"

type Props = {
  currentLogo: string | null
  currentBanners: string[]
}

export default function SettingsForm({ currentLogo, currentBanners }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Multiple banners state
  const [keptBanners, setKeptBanners] = useState<string[]>(currentBanners)
  const [newBanners, setNewBanners] = useState<{ file: File; preview: string }[]>([])

  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleLogoSelect = (file: File | null) => {
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const clearLogoPreview = () => {
    setLogoPreview(null)
    setLogoFile(null)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const handleBannerSelect = (files: FileList | null) => {
    if (!files) return
    const newFilesArray = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewBanners((prev) => [...prev, ...newFilesArray])
    // Clear input so same file can be selected again if removed
    if (bannerInputRef.current) bannerInputRef.current.value = ""
  }

  const removeKeptBanner = (index: number) => {
    setKeptBanners((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewBanner = (index: number) => {
    setNewBanners((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData()
    
    // Logo
    if (logoFile) fd.append("logo", logoFile)
    
    // Banners
    fd.append("keptBanners", JSON.stringify(keptBanners))
    newBanners.forEach((b) => fd.append("newBanners", b.file))

    startTransition(async () => {
      await updateSettingsAction(fd)
      setSaved(true)
      // Clear newly uploaded states so they become "kept" on next refresh
      setNewBanners([])
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="w-48 h-16 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center p-2">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            ) : currentLogo ? (
              <img src={currentLogo} alt="Current logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No logo set</span>
            )}
          </div>

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
                onClick={clearLogoPreview}
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
          onChange={(e) => handleLogoSelect(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* ── Homepage Banners ──────────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Upload size={20} className="text-emerald-600" /> Homepage Banners
          </h2>
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 rounded-lg transition text-sm font-medium flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          >
            <Upload size={16} /> Add Banners
          </button>
        </div>
        <p className="text-gray-500 text-xs mb-6">
          Upload multiple rotating banners. Recommended size: 1600×520px. They will cycle every 7 seconds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kept Banners */}
          {keptBanners.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 aspect-[3/1]">
              <img src={url} alt="Saved Banner" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeKeptBanner(i)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-medium">
                Saved (Slide {i + 1})
              </div>
            </div>
          ))}

          {/* New Banners */}
          {newBanners.map((item, i) => (
            <div key={item.preview} className="relative group rounded-xl overflow-hidden border-2 border-emerald-400 aspect-[3/1]">
              <img src={item.preview} alt="New Banner Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewBanner(i)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-bold">
                New (Pending Save)
              </div>
            </div>
          ))}

          {keptBanners.length === 0 && newBanners.length === 0 && (
            <div className="md:col-span-2 py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No banners set</p>
              <p className="text-xs mt-1 text-gray-500 max-w-sm text-center">
                The default dummy slides will be shown until you upload a banner.
              </p>
            </div>
          )}
        </div>

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleBannerSelect(e.target.files)}
        />
      </div>

      {/* ── Save Button ──────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Save size={18} />
          {isPending ? "Saving changes..." : "Save Settings"}
        </button>
      </div>
    </form>
  )
}
