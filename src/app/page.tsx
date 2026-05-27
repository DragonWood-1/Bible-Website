"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Heart, Mic, Share2, Bookmark, Star, Sun, Moon, RefreshCw,
  ChevronRight, Sparkles, Music, Users, Baby, Brain, Flower2
} from "lucide-react";
import { dailyVerses, affirmations, prayerPrompts } from "@/data/verses";

const MOODS = [
  { id: "anxiety", emoji: "🌊", label: "Anxiety", color: "bg-blue-500/20 border-blue-400/40 hover:bg-blue-500/30" },
  { id: "fear", emoji: "🛡️", label: "Fear", color: "bg-indigo-500/20 border-indigo-400/40 hover:bg-indigo-500/30" },
  { id: "motivation", emoji: "🔥", label: "Motivation", color: "bg-orange-500/20 border-orange-400/40 hover:bg-orange-500/30" },
  { id: "healing", emoji: "💚", label: "Healing", color: "bg-green-500/20 border-green-400/40 hover:bg-green-500/30" },
  { id: "confidence", emoji: "⭐", label: "Confidence", color: "bg-yellow-500/20 border-yellow-400/40 hover:bg-yellow-500/30" },
  { id: "marriage", emoji: "💑", label: "Marriage", color: "bg-pink-500/20 border-pink-400/40 hover:bg-pink-500/30" },
  { id: "parenting", emoji: "👨‍👩‍👧", label: "Parenting", color: "bg-purple-500/20 border-purple-400/40 hover:bg-purple-500/30" },
  { id: "grief", emoji: "🕊️", label: "Grief", color: "bg-gray-500/20 border-gray-400/40 hover:bg-gray-500/30" },
];

const FEATURES = [
  { href: "/encouragement", icon: Sparkles, label: "AI Encouragement", desc: "Type how you feel and receive personalized scriptures, affirmations, and prayer.", color: "from-purple-600 to-indigo-600" },
  { href: "/verses", icon: BookOpen, label: "Scripture Library", desc: "Search Bible verses by topic, emotion, or life situation.", color: "from-blue-600 to-cyan-600" },
  { href: "/wellness", icon: Brain, label: "Mental Wellness", desc: "Biblical support for anxiety, depression, grief, loneliness, and more.", color: "from-green-600 to-teal-600" },
  { href: "/meditation", icon: Music, label: "Sleep & Meditation", desc: "Scripture sleep stories, guided prayer meditation, and calming audio.", color: "from-indigo-600 to-purple-600" },
  { href: "/journal", icon: Heart, label: "Reflection Journal", desc: "Journal your faith journey with guided prompts and scripture.", color: "from-red-600 to-pink-600" },
  { href: "/prayer", icon: Flower2, label: "Prayer Wall", desc: "Share requests, pray for others, and build your prayer habit.", color: "from-amber-600 to-orange-600" },
  { href: "/couples", icon: Users, label: "Couples & Marriage", desc: "Daily couples devotionals, marriage affirmations, and prayer.", color: "from-rose-600 to-pink-600" },
  { href: "/kids", icon: Baby, label: "Kids Corner", desc: "Bible memory games, animated stories, and bedtime verses for children.", color: "from-yellow-600 to-amber-600" },
];

export default function HomePage() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

  const todayVerse = dailyVerses[dayOfYear % dailyVerses.length];
  const todayAffirmation = affirmations[(dayOfYear + 3) % affirmations.length];
  const todayPrayer = prayerPrompts[dayOfYear % prayerPrompts.length];

  const [savedVerses, setSavedVerses] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodVerse, setMoodVerse] = useState<typeof dailyVerses[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [streak] = useState(7);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 20 || hour < 6);
    const saved = localStorage.getItem("savedVerses");
    if (saved) setSavedVerses(JSON.parse(saved));
  }, []);

  function handleMoodSelect(moodId: string) {
    setSelectedMood(moodId);
    const candidates = dailyVerses.filter(v => v.topic.includes(moodId));
    const pool = candidates.length > 0 ? candidates : dailyVerses.filter(v => v.topic.includes("peace") || v.topic.includes("hope"));
    setMoodVerse(pool[Math.floor(Math.random() * pool.length)]);
  }

  function handleSave(reference: string) {
    setSavedVerses(prev => {
      const updated = prev.includes(reference)
        ? prev.filter(r => r !== reference)
        : [...prev, reference];
      localStorage.setItem("savedVerses", JSON.stringify(updated));
      return updated;
    });
  }

  async function handleShare(text: string) {
    if (navigator.share) {
      await navigator.share({ title: "FaithLifted", text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const GreetingIcon = isNight ? Moon : Sun;
  const greeting = isNight ? "Good evening" : new Date().getHours() < 12 ? "Good morning" : "Good afternoon";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => {
            const sizes = [1, 1, 1, 2, 2, 3];
            const px = sizes[i % sizes.length];
            const dur = (2.2 + (i * 0.47) % 3.8).toFixed(1);
            const delay = ((i * 0.61) % 4).toFixed(1);
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white gentle-pulse"
                style={{
                  width: px,
                  height: px,
                  left: `${(i * 37 + 11) % 100}%`,
                  top: `${(i * 53 + 7) % 100}%`,
                  animationDelay: `${delay}s`,
                  "--twinkle-dur": `${dur}s`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-5">
            <GreetingIcon size={16} className="text-[#F0D27C] flex-shrink-0" />
            <span className="text-[#F0D27C] font-sans text-xs sm:text-sm tracking-wide sm:tracking-widest uppercase">{greeting} — Today&apos;s blessing awaits</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
            God&apos;s Word for
            <span className="block text-[#F0D27C]">Your Day</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-6 font-sans px-2">
            Daily Bible verses, faith affirmations, and AI-powered encouragement — tailored to your heart.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 mb-8">
            <Star size={13} className="text-[#F0D27C] fill-[#F0D27C]" />
            <span className="text-[#F0D27C] text-sm font-sans font-medium">{streak}-day faith streak</span>
            <Star size={13} className="text-[#F0D27C] fill-[#F0D27C]" />
          </div>

          {/* Verse of the Day Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-[#C9A84C]/30 p-5 sm:p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <BookOpen size={15} className="text-[#F0D27C]" />
              <span className="text-[#F0D27C] text-xs font-sans uppercase tracking-widest">Verse of the Day</span>
            </div>
            <blockquote className="text-white text-lg sm:text-2xl font-medium leading-relaxed mb-4 italic">
              &ldquo;{todayVerse.text}&rdquo;
            </blockquote>
            <p className="text-[#F0D27C] font-semibold font-sans mb-5">{todayVerse.reference}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => handleSave(todayVerse.reference)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans transition-all ${savedVerses.includes(todayVerse.reference) ? "bg-[#C9A84C] text-[#0F1B3D]" : "bg-white/10 text-white hover:bg-white/20"}`}
              >
                <Bookmark size={13} className={savedVerses.includes(todayVerse.reference) ? "fill-current" : ""} />
                {savedVerses.includes(todayVerse.reference) ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => handleShare(`"${todayVerse.text}" — ${todayVerse.reference}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-sans hover:bg-white/20 transition-all"
              >
                <Share2 size={13} />
                {copied ? "Copied!" : "Share"}
              </button>
              <Link href="/meditation" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-sans hover:bg-white/20 transition-all">
                <Mic size={13} />
                Listen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Affirmation of the Day */}
      <section className="bg-[#FDF8F0] py-10 sm:py-12 border-b border-[#F5ECD7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-divider mb-4" />
          <p className="text-[#8B6914] text-xs font-sans uppercase tracking-widest mb-4 mt-4">Affirmation of the Day</p>
          <p className="text-xl sm:text-3xl text-[#2C1810] font-medium leading-relaxed italic">
            &ldquo;{todayAffirmation}&rdquo;
          </p>
          <button
            onClick={() => { navigator.clipboard.writeText(todayAffirmation); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="mt-6 px-5 py-2 rounded-full bg-[#C9A84C] text-white text-sm font-sans hover:bg-[#8B6914] transition-colors"
          >
            {copied ? "Copied!" : "Copy Affirmation"}
          </button>
        </div>
      </section>

      {/* Mood Selector */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="section-divider mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1B3D] mt-4 mb-2">How are you feeling?</h2>
            <p className="text-gray-500 font-sans text-sm sm:text-base">Choose your mood and receive a Scripture handpicked for you.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all mood-btn ${mood.color} ${selectedMood === mood.id ? "scale-105 shadow-lg" : ""}`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-sm font-sans font-medium text-[#0F1B3D]">{mood.label}</div>
              </button>
            ))}
          </div>

          {moodVerse && (
            <div className="bg-gradient-to-r from-[#0F1B3D] to-[#1E3A6E] rounded-2xl p-8 text-center">
              <p className="text-[#F0D27C] text-xs font-sans uppercase tracking-widest mb-4">
                Scripture for {selectedMood ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1) : ""}
              </p>
              <blockquote className="text-white text-xl font-medium italic leading-relaxed mb-4">
                &ldquo;{moodVerse.text}&rdquo;
              </blockquote>
              <p className="text-[#F0D27C] font-semibold font-sans mb-4">{moodVerse.reference}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleSave(moodVerse.reference)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans transition-all ${savedVerses.includes(moodVerse.reference) ? "bg-[#C9A84C] text-[#0F1B3D]" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  <Bookmark size={13} />
                  {savedVerses.includes(moodVerse.reference) ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => selectedMood && handleMoodSelect(selectedMood)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-sans hover:bg-white/20 transition-all"
                >
                  <RefreshCw size={13} />
                  Another verse
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Prayer of the Day */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-[#FDF8F0] to-[#F5ECD7]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-divider mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1B3D] mt-4 mb-2">Today&apos;s Prayer</h2>
          <p className="text-gray-500 font-sans mb-6">Start your conversation with God</p>
          <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-5 sm:p-8">
            <div className="text-4xl mb-4">🙏</div>
            <p className="text-lg text-[#2C1810] leading-relaxed italic mb-6">{todayPrayer}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/prayer" className="px-6 py-3 rounded-full bg-[#0F1B3D] text-[#F0D27C] font-sans text-sm hover:bg-[#1E3A6E] transition-colors">
                Visit Prayer Wall
              </Link>
              <Link href="/journal" className="px-6 py-3 rounded-full border border-[#C9A84C] text-[#8B6914] font-sans text-sm hover:bg-[#F5ECD7] transition-colors">
                Journal Response
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-divider mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1B3D] mt-4 mb-3">Everything You Need</h2>
            <p className="text-gray-500 font-sans text-base sm:text-lg">for a deeper, more consistent faith walk</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href} className="group bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 card-hover shadow-sm">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#0F1B3D] text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-[#8B6914] transition-colors">{feature.label}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed hidden sm:block">{feature.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-[#C9A84C] text-xs sm:text-sm font-sans">
                    <span>Explore</span>
                    <ChevronRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Morning & Night Routines CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#0F1B3D] to-[#3D1F6E]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Sun, title: "Morning Routine", desc: "Start your day with a verse, affirmation, and prayer. Just 5 minutes of intentional faith sets the tone for everything.", href: "/journal", cta: "Start Morning Devotion" },
            { icon: Moon, title: "Night Reflection", desc: "Wind down with scripture sleep stories, peaceful affirmations, and guided prayer meditation to rest in God's peace.", href: "/meditation", cta: "Begin Night Meditation" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white/10 backdrop-blur rounded-2xl border border-[#C9A84C]/30 p-8 text-center">
                <Icon size={40} className="text-[#F0D27C] mx-auto mb-4" />
                <h3 className="text-white text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300 font-sans text-sm mb-6 leading-relaxed">{item.desc}</p>
                <Link href={item.href} className="inline-block px-6 py-3 rounded-full bg-[#C9A84C] text-[#0F1B3D] font-sans font-semibold text-sm hover:bg-[#F0D27C] transition-colors">
                  {item.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-[#FDF8F0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="section-divider mb-4" />
            <h2 className="text-3xl font-bold text-[#0F1B3D] mt-4">Lives Being Transformed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "This site helped me through my hardest season. The AI encouragement felt like a message directly from God.", name: "Sarah M.", loc: "Texas" },
              { quote: "My husband and I do the couples devotional every morning. It has transformed our marriage and our prayer life.", name: "Jennifer K.", loc: "Georgia" },
              { quote: "The wellness section for anxiety has the most powerful scriptures. I feel seen and heard every time I visit.", name: "Marcus T.", loc: "California" },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#F5ECD7] shadow-sm">
                <div className="flex mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={13} className="text-[#C9A84C] fill-[#C9A84C]" />)}</div>
                <p className="text-[#2C1810] italic text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-xs font-sans text-gray-500"><span className="font-semibold text-[#0F1B3D]">{t.name}</span> · {t.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-t border-[#F5ECD7]">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B3D] mb-2">Daily Verse to Your Inbox</h2>
          <p className="text-gray-500 font-sans text-sm mb-6">Receive your daily Bible verse, affirmation, and prayer prompt every morning — free.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-full border-2 border-[#F5ECD7] font-sans text-sm focus:outline-none focus:border-[#C9A84C] bg-[#FDF8F0]" />
            <button className="px-6 py-3 rounded-full bg-[#0F1B3D] text-[#F0D27C] font-sans font-semibold text-sm hover:bg-[#1E3A6E] transition-colors whitespace-nowrap">Subscribe Free</button>
          </div>
        </div>
      </section>
    </div>
  );
}
