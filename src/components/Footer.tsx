import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#140A02] border-t border-[#9D7A2C]/20 text-[#9D7A2C]">
      {/* Gold rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#9D7A2C]/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-[#EDE0BF] font-serif text-lg mb-3"
               style={{ fontVariant: "small-caps", letterSpacing: "0.1em" }}>
              ✦ FaithLifted
            </p>
            <p className="text-sm text-[#9D7A2C]/80 font-serif leading-relaxed italic">
              &ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo;
            </p>
            <p className="text-xs text-[#9D7A2C]/50 font-serif mt-1" style={{ fontVariant: "small-caps" }}>
              Psalm 119:105
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[#C4963A] font-serif text-xs uppercase tracking-[0.15em] mb-4"
                style={{ fontVariant: "small-caps" }}>Features</h3>
            <ul className="space-y-2 text-sm font-serif">
              {[["Daily Verse", "/"], ["AI Encouragement", "/encouragement"], ["Scripture Library", "/verses"], ["Mental Wellness", "/wellness"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-[#9D7A2C]/70 hover:text-[#EDE0BF] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-[#C4963A] font-serif text-xs uppercase tracking-[0.15em] mb-4"
                style={{ fontVariant: "small-caps" }}>Community</h3>
            <ul className="space-y-2 text-sm font-serif">
              {[["Prayer Wall", "/prayer"], ["Scripture Meditation", "/meditation"], ["Reflection Journal", "/journal"], ["Marriage Devotional", "/couples"], ["Children&rsquo;s Corner", "/kids"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-[#9D7A2C]/70 hover:text-[#EDE0BF] transition-colors" dangerouslySetInnerHTML={{ __html: l }} /></li>
              ))}
            </ul>
          </div>

          {/* Promise */}
          <div>
            <h3 className="text-[#C4963A] font-serif text-xs uppercase tracking-[0.15em] mb-4"
                style={{ fontVariant: "small-caps" }}>Today&apos;s Promise</h3>
            <blockquote className="text-sm font-serif italic text-[#9D7A2C]/80 leading-relaxed border-l border-[#9D7A2C]/40 pl-3">
              &ldquo;The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.&rdquo;
              <span className="block mt-1 not-italic text-[#9D7A2C]/60"
                    style={{ fontVariant: "small-caps", fontSize: "0.8em", letterSpacing: "0.06em" }}>
                Numbers 6:24–25
              </span>
            </blockquote>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#9D7A2C]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9D7A2C]/40 font-serif">
          <p>© {new Date().getFullYear()} FaithLifted. For the glory of God.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-[#9D7A2C] transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
