import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F1B3D] border-t border-[#C9A84C]/20 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0D27C] flex items-center justify-center">
                <BookOpen size={16} className="text-[#0F1B3D]" />
              </div>
              <span className="text-[#F0D27C] font-bold text-xl">FaithLifted</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Daily biblical encouragement, faith-based affirmations, and AI-powered spiritual support for your journey.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[#F0D27C] font-semibold mb-3 text-sm uppercase tracking-wider">Features</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Daily Verse", "/"],
                ["AI Encouragement", "/encouragement"],
                ["Scripture Library", "/verses"],
                ["Wellness Support", "/wellness"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#F0D27C] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-[#F0D27C] font-semibold mb-3 text-sm uppercase tracking-wider">Community</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Prayer Wall", "/prayer"],
                ["Scripture Meditation", "/meditation"],
                ["Reflection Journal", "/journal"],
                ["Couples Devotional", "/couples"],
                ["Kids Corner", "/kids"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#F0D27C] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Daily Scripture */}
          <div>
            <h3 className="text-[#F0D27C] font-semibold mb-3 text-sm uppercase tracking-wider">Today&apos;s Promise</h3>
            <blockquote className="text-sm italic text-gray-400 border-l-2 border-[#C9A84C] pl-3">
              &ldquo;The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.&rdquo;
              <span className="block mt-1 text-[#C9A84C] not-italic">Numbers 6:24-25</span>
            </blockquote>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FaithLifted. Built with <Heart size={12} className="inline text-red-400 mx-1" /> for the Kingdom.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#F0D27C] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#F0D27C] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#F0D27C] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
