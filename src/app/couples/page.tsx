"use client";

import { useState } from "react";
import { Heart, BookOpen, Loader2, Share2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { dailyVerses, affirmations } from "@/data/verses";

const MARRIAGE_VERSES = dailyVerses.filter(v => v.topic.includes("marriage") || v.topic.includes("love") || v.topic.includes("relationships"));

const DEVOTIONALS = [
  {
    day: "Day 1",
    title: "The Foundation of Faith Together",
    scripture: "Joshua 24:15",
    text: "Every strong marriage is built on a shared foundation in Christ. As you and your spouse commit to seeking God together, He promises to guide your paths and bless your union.",
    discussion: "How can we prioritize our faith as a couple this week? What spiritual habit can we start together?",
    prayer: "Lord, let our marriage be rooted in You. As we seek You individually and together, bind our hearts in Your love.",
  },
  {
    day: "Day 2",
    title: "Choosing Love Daily",
    scripture: "1 Corinthians 13:4-7",
    text: "Love is not a feeling — it is a daily decision. God calls us to choose patience, kindness, and selflessness toward our spouse, especially when it is hard.",
    discussion: "In what area can I choose to love my spouse more intentionally this week?",
    prayer: "Father, teach us to love the way You love — unconditionally and sacrificially. Help us choose love in every moment.",
  },
  {
    day: "Day 3",
    title: "Forgiveness: The Gift That Heals",
    scripture: "Ephesians 4:32",
    text: "No marriage is without hurt, but couples who thrive have mastered the art of forgiveness. God has forgiven us much — may we freely forgive one another.",
    discussion: "Is there something unspoken between us that needs forgiveness? Can we create space for that conversation today?",
    prayer: "God, soften our hearts toward each other. Help us release offenses quickly and restore our connection in Your grace.",
  },
  {
    day: "Day 4",
    title: "Unity in the Storm",
    scripture: "Ecclesiastes 4:9-12",
    text: "Two are better than one. When trials come, God invites couples to face them together — with Him as the cord that holds them both.",
    discussion: "What challenge are we facing right now? How can we support each other better through it?",
    prayer: "Lord, make us each other's greatest ally. When the storms come, let us turn toward each other — and toward You.",
  },
  {
    day: "Day 5",
    title: "Speaking Life to Each Other",
    scripture: "Proverbs 18:21",
    text: "Words have the power to build up or tear down. God calls couples to speak life, encouragement, and affirmation over one another every day.",
    discussion: "What words of affirmation does my spouse most need to hear from me right now?",
    prayer: "Father, put words of life and love on our tongues. Let our home be filled with encouragement and Your Spirit.",
  },
];

const COUPLES_AFFIRMATIONS = [
  "Our marriage is covered by God's grace and protected by His love.",
  "We choose each other today and every day — just as God chose us.",
  "Our home is a place of peace, laughter, and God's presence.",
  "We grow stronger together through every season and trial.",
  "God's purpose for our marriage is bigger than either of us alone.",
];

void affirmations;

export default function CouplesPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [generatedPrayer, setGeneratedPrayer] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const todayAffirmation = COUPLES_AFFIRMATIONS[dayOfYear % COUPLES_AFFIRMATIONS.length];
  const todayVerse = MARRIAGE_VERSES[dayOfYear % MARRIAGE_VERSES.length];

  async function generateCouplesPrayer() {
    setPrayerLoading(true);
    try {
      const response = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "marriage and couples, unity, love, and commitment" }),
      });
      const data = await response.json();
      setGeneratedPrayer(data.prayer);
    } catch {
      setGeneratedPrayer("Father, bless our marriage today. Keep us united in love and purpose, quick to forgive, and slow to anger. Let Your love flow through us to each other. Bind our hearts together and let our home reflect Your glory. In Jesus' name, Amen.");
    } finally {
      setPrayerLoading(false);
    }
  }

  async function handleShare(text: string) {
    if (navigator.share) await navigator.share({ title: "FaithLifted", text });
    else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  return (
    <div className="min-h-screen bg-[#F8F0DC]">
      <PageHeader
        eyebrow="Marriage"
        title="Couples & Marriage"
        subtitle="Strengthen your marriage through scripture, devotion, and prayer — together."
      />
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Today's verse */}
            <div className="bg-[#6B1A1A] border border-[#8B2424] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={15} className="text-[#C8B888]/60" />
                <span className="text-[#C8B888]/70 text-xs font-sans uppercase tracking-widest"
                      style={{ fontVariant: "small-caps" }}>Today&apos;s Marriage Scripture</span>
              </div>
              <blockquote className="verse-text text-[#F5EDD5] text-xl leading-relaxed mb-3">
                &ldquo;{todayVerse.text}&rdquo;
              </blockquote>
              <p className="verse-ref text-[#C8B078] mb-4">{todayVerse.reference}</p>
              <button
                onClick={() => handleShare(`"${todayVerse.text}" — ${todayVerse.reference}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F0DC]/10 border border-[#9D7A2C]/40 text-[#F5EDD5] text-sm font-sans hover:bg-[#F8F0DC]/20 transition-all"
              >
                <Share2 size={13} />
                {copied ? "Copied!" : "Share with Spouse"}
              </button>
            </div>

            {/* Today's affirmation */}
            <div className="parchment-card rounded-xl p-6 text-center">
              <Heart size={24} className="text-[#6B1A1A] mx-auto mb-3" />
              <p className="text-[#9D7A2C] text-xs font-sans uppercase tracking-widest mb-3"
                 style={{ fontVariant: "small-caps" }}>Couples Affirmation</p>
              <p className="text-xl text-[#1A0800] font-serif italic leading-relaxed mb-4">&ldquo;{todayAffirmation}&rdquo;</p>
              <button
                onClick={() => { navigator.clipboard.writeText(todayAffirmation); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="px-5 py-2 rounded-full btn-primary text-sm font-sans"
              >
                {copied ? "Copied!" : "Share This"}
              </button>
            </div>

            {/* 5-Day Devotional */}
            <div className="parchment-card rounded-xl overflow-hidden">
              <div className="bg-[#1C1008] border-b border-[#9D7A2C]/30 p-4">
                <h2 className="font-serif text-[#F5EDD5]">5-Day Marriage Devotional</h2>
                <p className="text-[#9D7A2C] text-xs font-sans mt-1">Building a God-centered marriage together</p>
              </div>

              {/* Day tabs */}
              <div className="flex border-b border-[#DCCFA0] overflow-x-auto scrollbar-none -mb-px">
                {DEVOTIONALS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`px-4 py-3 text-sm font-sans whitespace-nowrap transition-all flex-shrink-0 ${
                      activeDay === i
                        ? "border-b-2 border-[#6B1A1A] text-[#6B1A1A] font-semibold"
                        : "text-[#7A5020] hover:text-[#1A0800]"
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-serif text-[#1A0800] text-lg mb-1">{DEVOTIONALS[activeDay].title}</h3>
                <p className="text-[#9D7A2C] text-sm font-sans mb-4">{DEVOTIONALS[activeDay].scripture}</p>
                <p className="text-[#4A2800] font-serif leading-relaxed mb-5">{DEVOTIONALS[activeDay].text}</p>

                <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-4 mb-4">
                  <p className="text-[#9D7A2C] text-xs font-sans uppercase tracking-widest mb-2"
                     style={{ fontVariant: "small-caps" }}>Discussion Question</p>
                  <p className="text-[#1A0800] font-serif text-sm italic leading-relaxed">{DEVOTIONALS[activeDay].discussion}</p>
                </div>

                <div className="bg-[#1C1008] border border-[#9D7A2C]/20 rounded-xl p-4">
                  <p className="text-[#9D7A2C] text-xs font-sans uppercase tracking-widest mb-2"
                     style={{ fontVariant: "small-caps" }}>Together Prayer</p>
                  <p className="text-[#C8B888] font-serif text-sm italic leading-relaxed">{DEVOTIONALS[activeDay].prayer}</p>
                </div>
              </div>
            </div>

            {/* Scripture gallery */}
            <div>
              <h2 className="font-serif text-[#1A0800] text-xl mb-4">More Marriage Scriptures</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MARRIAGE_VERSES.slice(0, 6).map(v => (
                  <div key={v.reference} className="parchment-card card-lift rounded-xl p-5">
                    <blockquote className="verse-text text-[#1A0800] text-sm leading-relaxed mb-3">&ldquo;{v.text}&rdquo;</blockquote>
                    <p className="verse-ref text-[#9D7A2C]">{v.reference}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Prayer generator */}
            <div className="bg-[#1C1008] border border-[#9D7A2C]/30 rounded-xl p-6">
              <h3 className="font-serif text-[#F5EDD5] text-lg mb-2">Couples Prayer Generator</h3>
              <p className="text-xs text-[#9D7A2C] font-sans mb-4">Generate a personalized prayer for your marriage to pray together.</p>
              <button
                onClick={generateCouplesPrayer}
                disabled={prayerLoading}
                className="w-full py-3 rounded-xl btn-gold font-sans font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {prayerLoading ? <><Loader2 size={14} className="spinner" /> Creating...</> : "Generate Couples Prayer"}
              </button>

              {generatedPrayer && (
                <div className="mt-4 bg-[#F8F0DC]/10 border border-[#9D7A2C]/20 rounded-xl p-4">
                  <p className="text-sm text-[#C8B888] font-serif leading-relaxed italic">{generatedPrayer}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(generatedPrayer); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="mt-3 text-xs text-[#9D7A2C] hover:text-[#F5EDD5] transition-colors font-sans"
                  >
                    {copied ? "Copied!" : "Copy Prayer"}
                  </button>
                </div>
              )}
            </div>

            {/* All affirmations */}
            <div className="parchment-card rounded-xl p-5">
              <h3 className="font-serif text-[#1A0800] text-lg mb-4 flex items-center gap-2">
                <Heart size={15} className="text-[#6B1A1A]" />
                Marriage Affirmations
              </h3>
              <div className="space-y-3">
                {COUPLES_AFFIRMATIONS.map((a, i) => (
                  <div key={i} className="border-l-2 border-[#9D7A2C] pl-3 text-sm text-[#4A2800] font-serif italic">{a}</div>
                ))}
              </div>
            </div>

            {/* Conflict resolution */}
            <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-5">
              <h3 className="font-serif text-[#1A0800] text-lg mb-3">Conflict Resolution</h3>
              <div className="space-y-3 text-sm text-[#4A2800] font-serif">
                <p className="verse-text">&ldquo;Do not let the sun go down while you are still angry.&rdquo; <span className="verse-ref">— Ephesians 4:26</span></p>
                <p className="verse-text">&ldquo;A gentle answer turns away wrath, but a harsh word stirs up anger.&rdquo; <span className="verse-ref">— Proverbs 15:1</span></p>
                <p className="verse-text">&ldquo;Bear with each other and forgive one another.&rdquo; <span className="verse-ref">— Colossians 3:13</span></p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[{ value: "5", label: "Days" }, { value: "∞", label: "Love" }, { value: "1", label: "God" }].map(s => (
                <div key={s.label} className="bg-[#1C1008] border border-[#9D7A2C]/30 rounded-xl p-3 text-center">
                  <div className="text-2xl font-serif text-[#C4963A]">{s.value}</div>
                  <div className="text-xs text-[#9D7A2C] font-sans">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
