"use client";

import { useState, useMemo } from "react";
import { Search, Bookmark, Share2, Filter } from "lucide-react";
import { dailyVerses } from "@/data/verses";

const ALL_TOPICS = Array.from(new Set(dailyVerses.flatMap(v => v.topic))).sort();

export default function VersesPage() {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [savedVerses, setSavedVerses] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedVerses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return dailyVerses.filter(v => {
      const matchesQuery = !query || v.text.toLowerCase().includes(query.toLowerCase()) || v.reference.toLowerCase().includes(query.toLowerCase());
      const matchesTopic = !selectedTopic || v.topic.includes(selectedTopic);
      return matchesQuery && matchesTopic;
    });
  }, [query, selectedTopic]);

  function handleSave(reference: string) {
    setSavedVerses(prev => {
      const updated = prev.includes(reference) ? prev.filter(r => r !== reference) : [...prev, reference];
      localStorage.setItem("savedVerses", JSON.stringify(updated));
      return updated;
    });
  }

  async function handleShare(verse: typeof dailyVerses[0]) {
    const text = `"${verse.text}" — ${verse.reference}`;
    if (navigator.share) {
      await navigator.share({ title: "FaithLifted", text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(verse.reference);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  const topicLabels: Record<string, string> = {
    anxiety: "😰 Anxiety", fear: "🛡️ Fear", strength: "💪 Strength", hope: "🌟 Hope",
    peace: "☮️ Peace", love: "❤️ Love", trust: "🤝 Trust", guidance: "🧭 Guidance",
    healing: "💚 Healing", grief: "🕊️ Grief", joy: "😊 Joy", prayer: "🙏 Prayer",
    faith: "✝️ Faith", wisdom: "💡 Wisdom", purpose: "🎯 Purpose", courage: "⚡ Courage",
    confidence: "⭐ Confidence", marriage: "💍 Marriage", parenting: "👨‍👩‍👧 Parenting",
    loneliness: "🤗 Loneliness", depression: "🌅 Depression", protection: "🏰 Protection",
    motivation: "🔥 Motivation", identity: "👑 Identity", rest: "🌙 Rest", morning: "☀️ Morning",
    trials: "⛰️ Trials", forgiveness: "🕊️ Forgiveness", gratitude: "🙌 Gratitude",
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="hero-bg py-10 sm:py-14 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Scripture Library</h1>
          <p className="text-gray-300 font-sans text-sm sm:text-base">Search God&apos;s Word by topic, emotion, or situation. Every verse handpicked for your journey.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search verses by keyword or reference..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#F5ECD7] bg-white font-sans text-[#2C1810] focus:outline-none focus:border-[#C9A84C] shadow-sm"
          />
        </div>

        {/* Topic filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={15} className="text-[#8B6914]" />
            <span className="text-sm text-[#8B6914] font-sans font-medium uppercase tracking-wide">Filter by Topic</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedTopic(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-sans transition-all border ${!selectedTopic ? "bg-[#0F1B3D] text-[#F0D27C] border-[#0F1B3D]" : "bg-white border-[#F5ECD7] text-gray-600 hover:border-[#C9A84C]"}`}
            >
              All ({dailyVerses.length})
            </button>
            {ALL_TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                className={`px-3 py-1.5 rounded-full text-sm font-sans transition-all border ${selectedTopic === topic ? "bg-[#C9A84C] text-white border-[#C9A84C]" : "bg-white border-[#F5ECD7] text-gray-600 hover:border-[#C9A84C]"}`}
              >
                {topicLabels[topic] ?? topic}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 font-sans mb-6">{filtered.length} verse{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Saved section */}
        {savedVerses.length > 0 && !query && !selectedTopic && (
          <div className="mb-8 bg-[#C9A84C]/10 rounded-2xl border border-[#C9A84C]/30 p-5">
            <h2 className="text-[#8B6914] font-semibold mb-3 flex items-center gap-2 font-sans">
              <Bookmark size={15} className="fill-[#8B6914]" />
              Saved Verses ({savedVerses.length})
            </h2>
            <div className="space-y-2">
              {dailyVerses.filter(v => savedVerses.includes(v.reference)).slice(0, 3).map(v => (
                <div key={v.reference} className="text-sm text-[#2C1810]">
                  <span className="italic">&ldquo;{v.text.slice(0, 80)}...&rdquo;</span>{" "}
                  <span className="text-[#8B6914] font-semibold font-sans">— {v.reference}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verse grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((verse) => (
            <div key={verse.reference} className="bg-white rounded-2xl border border-[#F5ECD7] p-6 card-hover shadow-sm">
              <blockquote className="text-[#2C1810] italic leading-relaxed mb-4">
                &ldquo;{verse.text}&rdquo;
              </blockquote>
              <p className="text-[#8B6914] font-semibold font-sans text-sm mb-3">{verse.reference}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {verse.topic.slice(0, 4).map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    className="px-2 py-0.5 rounded-full bg-[#FDF8F0] border border-[#F5ECD7] text-xs text-gray-500 font-sans hover:border-[#C9A84C] transition-colors"
                  >
                    {topicLabels[t] ?? t}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(verse.reference)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all ${savedVerses.includes(verse.reference) ? "bg-[#C9A84C] text-white" : "bg-[#FDF8F0] border border-[#F5ECD7] text-gray-600 hover:border-[#C9A84C]"}`}
                >
                  <Bookmark size={11} className={savedVerses.includes(verse.reference) ? "fill-current" : ""} />
                  {savedVerses.includes(verse.reference) ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => handleShare(verse)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF8F0] border border-[#F5ECD7] text-xs text-gray-600 font-sans hover:border-[#C9A84C] transition-all"
                >
                  <Share2 size={11} />
                  {copied === verse.reference ? "Copied!" : "Share"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-[#0F1B3D] mb-2">No verses found</h3>
            <p className="text-gray-500 font-sans">Try a different keyword or topic.</p>
          </div>
        )}
      </div>
    </div>
  );
}
