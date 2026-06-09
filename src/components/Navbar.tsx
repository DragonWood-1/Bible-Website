"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/encouragement", label: "Encouragement" },
  { href: "/verses", label: "Scripture" },
  { href: "/wellness", label: "Wellness" },
  { href: "/meditation", label: "Meditation" },
  { href: "/journal", label: "Journal" },
  { href: "/prayer", label: "Prayer" },
  { href: "/couples", label: "Marriage" },
  { href: "/kids", label: "Children" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1C1008] border-b border-[#9D7A2C]/30">
      {/* Top gold rule */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#9D7A2C] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-[#9D7A2C] text-lg font-serif tracking-wide">✦</span>
            <span
              className="text-[#EDE0BF] font-serif tracking-widest text-sm sm:text-base"
              style={{ fontVariant: "small-caps", letterSpacing: "0.12em" }}
            >
              FaithLifted
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs tracking-wider transition-colors duration-150 font-serif ${
                  pathname === link.href
                    ? "text-[#C4963A] border-b border-[#9D7A2C]"
                    : "text-[#C8B888]/80 hover:text-[#EDE0BF]"
                }`}
                style={{ fontVariant: "small-caps" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#C8B888] p-2"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-[#1C1008] border-t border-[#9D7A2C]/20 px-4 pb-4 pt-2">
          <div className="grid grid-cols-2 gap-1">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 text-sm font-serif rounded transition-colors ${
                  pathname === link.href
                    ? "text-[#C4963A] bg-[#9D7A2C]/10"
                    : "text-[#C8B888]/80 hover:text-[#EDE0BF] hover:bg-white/5"
                }`}
                style={{ fontVariant: "small-caps", letterSpacing: "0.05em" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
