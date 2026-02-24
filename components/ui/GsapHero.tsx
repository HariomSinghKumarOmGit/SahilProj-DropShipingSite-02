"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"

export default function GsapHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2 }
      )
      .fromTo(
        paragraphRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -top-[200px] -left-[100px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 bottom-[100px] -right-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 
          ref={headingRef} 
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          style={{ opacity: 0 }}
        >
          Elevate Your Style with <span className="text-blue-600 dark:text-blue-400">Premium</span> Quality
        </h1>
        <p 
          ref={paragraphRef}
          className="mt-4 text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-poppins"
          style={{ opacity: 0 }}
        >
          Discover our exclusive collection of modern, meticulously crafted products designed for those who appreciate true elegance and performance.
        </p>
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ opacity: 0 }}
        >
          <Link 
            href="/shop" 
            className="px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto text-center"
          >
            Shop Collection
          </Link>
          <Link 
            href="/about" 
            className="px-8 py-4 text-base font-semibold text-gray-900 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 shadow-sm w-full sm:w-auto text-center"
          >
            Explore Brand
          </Link>
        </div>
      </div>
    </section>
  )
}
