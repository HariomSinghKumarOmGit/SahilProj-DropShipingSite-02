import Link from "next/link"
import { Zap, ShieldCheck, ShoppingBag, Mail, Instagram, Youtube } from "lucide-react"

const trustSignals = [
  {
    icon: <Zap size={26} />,
    title: "Fast Delivery",
    desc: "Lightning fast shipping. Delivered within 48 hours.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Secure Payments",
    desc: "Industry-leading encryption protects every transaction.",
  },
  {
    icon: <ShoppingBag size={26} />,
    title: "Premium Quality",
    desc: "100% satisfaction guaranteed on all products.",
  },
]

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Categories", href: "/categories" },
]

const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* ── Pre-Footer Trust Signals ── */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {trustSignals.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[15px] mb-1 tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Links Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 font-montserrat">
              Viral Nova
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Curated drops that define trends. Shop boldly, delivered fast.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@yourdomain.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Mail size={16} className="shrink-0" />
                  contact@yourdomain.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Instagram size={16} className="shrink-0" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <Youtube size={16} className="shrink-0" />
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Viral Nova. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
