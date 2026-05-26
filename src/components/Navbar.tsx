"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/encouragement", label: "Encouragement" },
  { href: "/verses", label: "Scriptures" },
  { href: "/wellness", label: "Wellness" },
  { href: "/meditation", label: "Meditation" },
  { href: "/journal", label: "Journal" },
  { href: "/prayer", label: "Prayer" },
  { href: "/couples", label: "Couples" },
  { href: "/kids", label: "Kids" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1B3D]/95 backdrop-blur-sm border-b border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0D27C] flex items-center justify-center">
              <BookOpen size={16} className="text-[#0F1B3D]" />
            </div>
            <span className="text-[#F0D27C] font-bold text-lg tracking-wide">FaithLifted</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 font-sans ${
                  pathname === link.href
                    ? "text-[#F0D27C] bg-[#C9A84C]/20 border border-[#C9A84C]/40"
                    : "text-gray-300 hover:text-[#F0D27C] hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#F0D27C] p-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#0F1B3D] border-t border-[#C9A84C]/20 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-sm rounded-md mb-1 transition-all font-sans ${
                pathname === link.href
                  ? "text-[#F0D27C] bg-[#C9A84C]/20"
                  : "text-gray-300 hover:text-[#F0D27C] hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
