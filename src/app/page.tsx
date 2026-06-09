"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Share2, RefreshCw, ChevronRight } from "lucide-react";
import { dailyVerses, affirmations, prayerPrompts } from "@/data/verses";

const MOODS = [
  { id: "anxiety",    emoji: "🌊", label: "Anxiety" },
  { id: "fear",       emoji: "🛡️", label: "Fear" },
  { id: "motivation", emoji: "🔥", label: "Motivation" },
  { id: "healing",    emoji: "💚", label: "Healing" },
  { id: "confidence", emoji: "✦",  label: "Confidence" },
  { id: "marriage",   emoji: "💍", label: "Marriage" },
  { id: "parenting",  emoji: "👨‍👩‍👧", label: "Parenting" },
  { id: "grief",      emoji: "🕊️", label: "Grief" },
];

const FEATURES = [
  { href: "/encouragement", symbol: "✦", label: "AI Encouragement",  desc: "Share how you feel. Receive a verse, affirmation, and prayer crafted for your heart." },
  { href: "/verses",        symbol: "✝", label: "Scripture Library", desc: "Search 60+ verses by topic, emotion, or life situation." },
  { href: "/wellness",      symbol: "☩", label: "Mental Wellness",   desc: "Biblical care for anxiety, grief, loneliness, depression, and more." },
  { href: "/meditation",    symbol: "✡", label: "Meditation",        desc: "Guided scripture sessions for sleep, morning, and peace." },
  { href: "/journal",       symbol: "✎", label: "Prayer Journal",    desc: "Gratitude, reflection, and daily prayer — recorded and kept." },
  { href: "/prayer",        symbol: "🙏", label: "Prayer Wall",      desc: "Lift up others. Stand in agreement. Build your prayer habit." },
  { href: "/couples",       symbol: "♡", label: "Marriage",          desc: "Five-day devotional, couples prayer, and restoration scriptures." },
  { href: "/kids",          symbol: "⭐", label: "Children",          desc: "Scripture memory games, bedtime stories, and faith affirmations." },
];

export default function HomePage() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const todayVerse      = dailyVerses[dayOfYear % dailyVerses.length];
  const todayAffirmation = affirmations[(dayOfYear + 3) % affirmations.length];
  const todayPrayer     = prayerPrompts[dayOfYear % prayerPrompts.length];

  const [saved, setSaved]             = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodVerse, setMoodVerse]     = useState<typeof dailyVerses[0] | null>(null);
  const [copied, setCopied]           = useState(false);
  const [isEvening, setIsEvening]     = useState(false);

  useEffect(() => {
    setIsEvening(new Date().getHours() >= 17);
    const s = localStorage.getItem("savedVerses");
    if (s) setSaved(JSON.parse(s));
  }, []);

  function handleSave(ref: string) {
    setSaved(prev => {
      const next = prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref];
      localStorage.setItem("savedVerses", JSON.stringify(next));
      return next;
    });
  }

  async function handleShare(text: string) {
    if (navigator.share) { await navigator.share({ title: "FaithLifted", text }); }
    else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  function pickMoodVerse(id: string) {
    setSelectedMood(id);
    const pool = dailyVerses.filter(v => v.topic.includes(id));
    const src  = pool.length ? pool : dailyVerses.filter(v => v.topic.includes("peace"));
    setMoodVerse(src[Math.floor(Math.random() * src.length)]);
  }

  return (
    <div className="min-h-screen">

      {/* ── Hero / Scripture of the Day ───────────────────────── */}
      <section className="scripture-header">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">

          {/* Time greeting */}
          <p className="text-[#9D7A2C] text-xs tracking-[0.25em] uppercase mb-8 font-serif"
             style={{ fontVariant: "small-caps" }}>
            {isEvening ? "Evening Blessing" : "Morning Blessing"} · {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </p>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-16 bg-[#9D7A2C]/40" />
            <span className="text-[#9D7A2C] text-base">✦</span>
            <div className="h-px flex-1 max-w-16 bg-[#9D7A2C]/40" />
          </div>

          {/* Verse */}
          <p className="text-[#EDE0BF]/70 text-xs tracking-[0.2em] uppercase mb-5 font-serif"
             style={{ fontVariant: "small-caps" }}>
            Verse of the Day
          </p>
          <blockquote className="text-[#F5EDD5] text-xl sm:text-3xl font-serif italic leading-relaxed mb-5 px-2">
            &ldquo;{todayVerse.text}&rdquo;
          </blockquote>
          <p className="text-[#C4963A] font-serif mb-8" style={{ fontVariant: "small-caps", letterSpacing: "0.08em" }}>
            — {todayVerse.reference}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => handleSave(todayVerse.reference)}
              className={`flex items-center gap-2 px-5 py-2 rounded text-sm font-serif transition-all border ${
                saved.includes(todayVerse.reference)
                  ? "bg-[#9D7A2C] text-[#1C1008] border-[#9D7A2C]"
                  : "border-[#9D7A2C]/40 text-[#C8B888] hover:border-[#9D7A2C] hover:text-[#EDE0BF]"
              }`}
            >
              <Bookmark size={13} className={saved.includes(todayVerse.reference) ? "fill-current" : ""} />
              {saved.includes(todayVerse.reference) ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => handleShare(`"${todayVerse.text}" — ${todayVerse.reference}`)}
              className="flex items-center gap-2 px-5 py-2 rounded text-sm font-serif border border-[#9D7A2C]/40 text-[#C8B888] hover:border-[#9D7A2C] hover:text-[#EDE0BF] transition-all"
            >
              <Share2 size={13} />
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Affirmation ──────────────────────────────────────────── */}
      <section className="bg-[#EDE0BF] border-b border-[#DCCFA0]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-6 font-serif"
             style={{ fontVariant: "small-caps" }}>
            Today&apos;s Affirmation
          </p>
          <p className="text-[#1A0800] text-xl sm:text-2xl font-serif italic leading-relaxed mb-6">
            &ldquo;{todayAffirmation}&rdquo;
          </p>
          <button
            onClick={() => { navigator.clipboard.writeText(todayAffirmation); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="btn-outline px-5 py-2 rounded text-sm font-serif"
          >
            {copied ? "Copied" : "Copy Affirmation"}
          </button>
        </div>
      </section>

      {/* ── Mood Selector ────────────────────────────────────────── */}
      <section className="bg-[#F8F0DC] py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-2 font-serif"
               style={{ fontVariant: "small-caps" }}>
              Scripture by Mood
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A0800] mb-2">
              What does your heart need?
            </h2>
            <div className="section-rule mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => pickMoodVerse(mood.id)}
                className={`mood-btn py-3 px-3 rounded text-center ${selectedMood === mood.id ? "active" : ""}`}
              >
                <div className="text-xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-serif text-[#4A2800]"
                     style={{ fontVariant: "small-caps", letterSpacing: "0.06em" }}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>

          {moodVerse && (
            <div className="parchment-card rounded p-6 sm:p-8 fade-in">
              <p className="text-[#9D7A2C] text-xs tracking-[0.18em] uppercase mb-4 font-serif text-center"
                 style={{ fontVariant: "small-caps" }}>
                A Word for {selectedMood ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1) : ""}
              </p>
              <blockquote className="text-[#1A0800] text-lg sm:text-xl font-serif italic leading-relaxed mb-4 text-center">
                &ldquo;{moodVerse.text}&rdquo;
              </blockquote>
              <p className="text-[#9D7A2C] font-serif text-center mb-5"
                 style={{ fontVariant: "small-caps", letterSpacing: "0.08em", fontSize: "0.85rem" }}>
                — {moodVerse.reference}
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => handleSave(moodVerse.reference)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-serif border transition-all ${
                    saved.includes(moodVerse.reference)
                      ? "bg-[#9D7A2C] text-white border-[#9D7A2C]"
                      : "border-[#DCCFA0] text-[#4A2800] hover:border-[#9D7A2C]"
                  }`}
                >
                  <Bookmark size={12} className={saved.includes(moodVerse.reference) ? "fill-current" : ""} />
                  {saved.includes(moodVerse.reference) ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => selectedMood && pickMoodVerse(selectedMood)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-serif border border-[#DCCFA0] text-[#4A2800] hover:border-[#9D7A2C] transition-all"
                >
                  <RefreshCw size={12} />
                  Another verse
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Prayer of the Day ───────────────────────────────────── */}
      <section className="bg-[#1C1008] py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-2 font-serif"
             style={{ fontVariant: "small-caps" }}>
            Today&apos;s Prayer
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#9D7A2C]/30" />
            <span className="text-[#9D7A2C]">🙏</span>
            <div className="h-px w-12 bg-[#9D7A2C]/30" />
          </div>
          <p className="text-[#EDE0BF] font-serif italic text-lg leading-relaxed mb-8">
            {todayPrayer}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/prayer"
              className="px-6 py-2.5 rounded text-sm font-serif btn-gold"
              style={{ fontVariant: "small-caps", letterSpacing: "0.06em" }}>
              Prayer Wall
            </Link>
            <Link href="/journal"
              className="px-6 py-2.5 rounded text-sm font-serif btn-outline"
              style={{ fontVariant: "small-caps", letterSpacing: "0.06em" }}>
              Write in Journal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="bg-[#F8F0DC] py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-2 font-serif"
               style={{ fontVariant: "small-caps" }}>
              All Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A0800] mb-1">
              Every Tool for Your Faith Walk
            </h2>
            <div className="section-rule mt-4 max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#DCCFA0]">
            {FEATURES.map(f => (
              <Link
                key={f.href}
                href={f.href}
                className="bg-[#F8F0DC] p-5 sm:p-6 hover:bg-[#EDE0BF] transition-colors group"
              >
                <div className="text-[#9D7A2C] text-xl mb-3 font-serif">{f.symbol}</div>
                <h3 className="font-serif text-[#1A0800] mb-2 text-sm sm:text-base group-hover:text-[#6B1A1A] transition-colors"
                    style={{ fontVariant: "small-caps", letterSpacing: "0.04em" }}>
                  {f.label}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A5020] font-serif leading-relaxed hidden sm:block">
                  {f.desc}
                </p>
                <div className="flex items-center gap-1 mt-3 text-[#9D7A2C] text-xs font-serif"
                     style={{ fontVariant: "small-caps" }}>
                  Open <ChevronRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Morning & Evening Banner ─────────────────────────────── */}
      <section className="bg-[#EDE0BF] border-y border-[#DCCFA0] py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {[
            {
              time: "Morning",
              verse: "His mercies are new every morning.",
              ref: "Lamentations 3:23",
              desc: "Begin each day with a verse, an affirmation, and a prayer. Five minutes of intentional faith changes everything.",
              href: "/journal",
              cta: "Begin Morning Devotion",
            },
            {
              time: "Evening",
              verse: "In peace I will lie down and sleep.",
              ref: "Psalm 4:8",
              desc: "Close the day with scripture meditation, a quiet prayer, and rest in the peace that passes all understanding.",
              href: "/meditation",
              cta: "Evening Meditation",
            },
          ].map(item => (
            <div key={item.time} className="text-center sm:text-left">
              <p className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-3 font-serif"
                 style={{ fontVariant: "small-caps" }}>
                {item.time} Routine
              </p>
              <blockquote className="text-[#1A0800] text-lg font-serif italic leading-relaxed mb-1">
                &ldquo;{item.verse}&rdquo;
              </blockquote>
              <p className="verse-ref mb-4">{item.ref}</p>
              <p className="text-[#4A2800] font-serif text-sm leading-relaxed mb-5">{item.desc}</p>
              <Link href={item.href}
                className="inline-block btn-primary px-5 py-2 rounded text-sm font-serif"
                style={{ fontVariant: "small-caps", letterSpacing: "0.05em" }}>
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="bg-[#F8F0DC] py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#9D7A2C] text-xs tracking-[0.2em] uppercase mb-2 font-serif"
               style={{ fontVariant: "small-caps" }}>
              Testimonies
            </p>
            <h2 className="text-2xl font-serif text-[#1A0800]">Lives Touched by God&apos;s Word</h2>
            <div className="section-rule mt-4 max-w-xs mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { quote: "The encouragement chat brought me to tears. God spoke directly to my situation through that verse.", name: "Sarah M.", loc: "Texas" },
              { quote: "My husband and I do the couples devotional every morning. Our marriage has never been stronger.", name: "Jennifer K.", loc: "Georgia" },
              { quote: "The wellness section gave me the exact scripture I needed during my darkest season of anxiety.", name: "Marcus T.", loc: "California" },
            ].map((t, i) => (
              <div key={i} className="parchment-card rounded p-5">
                <div className="text-[#9D7A2C] text-2xl font-serif mb-3 leading-none">&ldquo;</div>
                <p className="text-[#1A0800] font-serif italic text-sm leading-relaxed mb-4">{t.quote}</p>
                <div className="border-t border-[#DCCFA0] pt-3">
                  <p className="text-[#4A2800] font-serif text-xs"
                     style={{ fontVariant: "small-caps", letterSpacing: "0.06em" }}>
                    {t.name} · {t.loc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────── */}
      <section className="bg-[#1C1008] py-14 px-4 sm:px-6 border-t border-[#9D7A2C]/20">
        <div className="max-w-lg mx-auto text-center">
          <div className="ornament mb-6">
            <span>✦</span>
          </div>
          <h2 className="text-[#EDE0BF] text-xl sm:text-2xl font-serif mb-2">
            Daily Verse by Email
          </h2>
          <p className="text-[#9D7A2C] font-serif italic text-sm mb-7">
            &ldquo;Thy word have I hid in mine heart.&rdquo; — Psalm 119:11
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded bg-[#1A0800] border border-[#9D7A2C]/40 text-[#EDE0BF] font-serif text-sm placeholder-[#9D7A2C]/50 focus:outline-none focus:border-[#9D7A2C]"
            />
            <button className="btn-gold px-5 py-2.5 rounded text-sm font-serif whitespace-nowrap"
                    style={{ fontVariant: "small-caps", letterSpacing: "0.05em" }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
