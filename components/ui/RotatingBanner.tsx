"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1600&q=80",
    headline: "Premium Return Gifts",
    sub: "Handpicked gifts that everyone will love",
    cta: "Shop Now",
    href: "/shop",
    accent: "#f59e0b",
    bg: "from-amber-50 to-yellow-100",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1600&q=80",
    headline: "Cute Kids Bags 🎒",
    sub: "Colorful & perfect for birthday parties",
    cta: "Explore",
    href: "/shop",
    accent: "#ec4899",
    bg: "from-pink-50 to-fuchsia-100",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1600&q=80",
    headline: "Jewellery & Accessories ✨",
    sub: "Elegant gifts for every occasion",
    cta: "Discover",
    href: "/shop",
    accent: "#8b5cf6",
    bg: "from-violet-50 to-purple-100",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80",
    headline: "Fun Stationery Sets 🖊️",
    sub: "Make school days extra special",
    cta: "Shop All",
    href: "/shop",
    accent: "#10b981",
    bg: "from-emerald-50 to-teal-100",
  },
]

export default function RotatingBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 7000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const nextSlide = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
      setAnimating(false)
    }, 400)
  }

  const goTo = (idx: number) => {
    if (idx === current || animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 400)
  }

  const slide = slides[current]

  return (
    <section
      className={`relative w-full h-[420px] md:h-[520px] flex items-center overflow-hidden bg-linear-to-r ${slide.bg} transition-all duration-700`}
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 transition-all duration-500 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
          Limited Time Offer
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 max-w-xl drop-shadow-lg">
          {slide.headline}
        </h1>
        <p className="text-lg md:text-xl text-white/85 mb-8 max-w-md">
          {slide.sub}
        </p>
        <Link
          href={slide.href}
          style={{ backgroundColor: slide.accent }}
          className="inline-block px-8 py-4 rounded-full text-white font-bold text-base shadow-xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {slide.cta} →
        </Link>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-5 right-6 z-20 text-white/60 text-sm font-medium">
        {current + 1} / {slides.length}
      </div>
    </section>
  )
}
