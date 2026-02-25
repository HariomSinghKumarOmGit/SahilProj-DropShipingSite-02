"use client"
import { useState } from "react"
import { ShoppingBag } from "lucide-react"

export default function ProductGallery({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState(0)

  const resolveImage = (url: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url;
    return `/uploads/${url}`;
  }

  const validImages = images.length > 0 ? images : [""]

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        <img 
          src={resolveImage(validImages[activeImage])} 
          alt="Product detail" 
          className="object-cover w-full h-full"
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {validImages.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveImage(idx)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img 
                src={resolveImage(img)} 
                alt={`Thumbnail ${idx + 1}`} 
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
