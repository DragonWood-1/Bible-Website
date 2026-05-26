"use client";

import { useState, useEffect } from "react";
import { PenLine, Save, Trash2, Calendar, Sun, Moon, BookOpen } from "lucide-react";
import { dailyVerses, prayerPrompts } from "@/data/verses";

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  gratitude: string;
  reflection: string;
  prayer: string;
  verseReference: string;
  verseText: string;
}

const JOURNAL_PROMPTS = [
  "What is God teaching me through today's circumstances?",
  "Where did I see God's hand at work today?",
  "What am I believing God for right now?",
  "What does this scripture mean for my life today?",
  "What is one thing I want to surrender to God today?",
  "How have I grown in faith this week?",
  "What am I most grateful for in this season?",
  "How can I be a blessing to someone this week?",
];

const MOODS = ["🙏 Grateful", "😔 Heavy-hearted", "💪 Strengthened", "😰 Anxious", "✨ Hopeful", "😢 Grieving", "🔥 Motivated", "☮️ Peaceful"];

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");
  const [prayer, setPrayer] = useState("");
  const [mood, setMood] = useState("");
  const [saved, setSaved] = useState(false);
  const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const todayVerse = dailyVerses[dayOfYear % dailyVerses.length];
  const todayPrompt = JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
  const todayPrayer = prayerPrompts[dayOfYear % prayerPrompts.length];

  const isEvening = today.getHours() >= 17;
  const TimeIcon = isEvening ? Moon : Sun;

  useEffect(() => {
    const stored = localStorage.getItem("journalEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  function handleSave() {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      mood,
      gratitude,
      reflection,
      prayer,
      verseReference: todayVerse.reference,
      verseText: todayVerse.text,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setSaved(true);
    setGratitude(""); setReflection(""); setPrayer(""); setMood("");
    setTimeout(() => setSaved(false), 3000);
  }

  function handleDelete(id: string) {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    if (viewEntry?.id === id) setViewEntry(null);
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="hero-bg py-14 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-3">Reflection Journal</h1>
          <p className="text-gray-300 font-sans">Document your faith journey, gratitude, and God&apos;s work in your life.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Journal form */}
          <div className="lg:col-span-2">
            {/* Date & Verse header */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FDF8F0] border border-[#F5ECD7] flex items-center justify-center">
                  <TimeIcon size={18} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="font-bold text-[#0F1B3D]">
                    {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <p className="text-xs text-gray-400 font-sans">{isEvening ? "Evening" : "Morning"} reflection</p>
                </div>
              </div>

              <div className="bg-[#FDF8F0] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={13} className="text-[#8B6914]" />
                  <span className="text-[#8B6914] text-xs font-sans uppercase tracking-wide">Today&apos;s Verse</span>
                </div>
                <p className="text-[#2C1810] italic text-sm leading-relaxed">&ldquo;{todayVerse.text}&rdquo;</p>
                <p className="text-[#8B6914] font-semibold text-sm font-sans mt-1">{todayVerse.reference}</p>
              </div>
            </div>

            {/* Mood selector */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-6 mb-6">
              <h3 className="font-bold text-[#0F1B3D] mb-3 flex items-center gap-2">
                <PenLine size={16} />
                How are you feeling today?
              </h3>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m === mood ? "" : m)}
                    className={`px-3 py-1.5 rounded-full text-sm font-sans transition-all border ${mood === m ? "bg-[#C9A84C] text-white border-[#C9A84C]" : "bg-[#FDF8F0] border-[#F5ECD7] text-gray-600 hover:border-[#C9A84C]"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-6 mb-6">
              <label className="block font-bold text-[#0F1B3D] mb-2">
                🙌 Three things I am grateful for
              </label>
              <textarea
                value={gratitude}
                onChange={e => setGratitude(e.target.value)}
                placeholder="1. &#10;2. &#10;3."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F5ECD7] font-sans text-sm text-[#2C1810] resize-none focus:outline-none focus:border-[#C9A84C] transition-colors bg-[#FDF8F0]"
              />
            </div>

            {/* Reflection prompt */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-6 mb-6">
              <label className="block font-bold text-[#0F1B3D] mb-1">
                📝 Today&apos;s Reflection
              </label>
              <p className="text-sm text-gray-400 font-sans italic mb-3">&ldquo;{todayPrompt}&rdquo;</p>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Write your thoughts, feelings, and what God is speaking to you..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F5ECD7] font-sans text-sm text-[#2C1810] resize-none focus:outline-none focus:border-[#C9A84C] transition-colors bg-[#FDF8F0]"
              />
            </div>

            {/* Prayer */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-6 mb-6">
              <label className="block font-bold text-[#0F1B3D] mb-1">🙏 My Prayer Today</label>
              <p className="text-xs text-gray-400 font-sans italic mb-3">Starter: &ldquo;{todayPrayer.slice(0, 60)}...&rdquo;</p>
              <textarea
                value={prayer}
                onChange={e => setPrayer(e.target.value)}
                placeholder="Write your personal prayer to God..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F5ECD7] font-sans text-sm text-[#2C1810] resize-none focus:outline-none focus:border-[#C9A84C] transition-colors bg-[#FDF8F0]"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!gratitude && !reflection && !prayer}
              className={`w-full py-4 rounded-2xl font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all ${saved ? "bg-green-500 text-white" : "bg-[#0F1B3D] text-[#F0D27C] hover:bg-[#1E3A6E] disabled:opacity-40"}`}
            >
              <Save size={16} />
              {saved ? "Journal Entry Saved! ✓" : "Save Today's Entry"}
            </button>
          </div>

          {/* Past entries */}
          <div>
            <h2 className="font-bold text-[#0F1B3D] text-lg mb-4 flex items-center gap-2">
              <Calendar size={16} />
              Past Entries ({entries.length})
            </h2>

            {entries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#F5ECD7] p-6 text-center">
                <div className="text-4xl mb-3">📖</div>
                <p className="text-gray-400 font-sans text-sm">Your journal entries will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${viewEntry?.id === entry.id ? "border-[#C9A84C] shadow-md" : "border-[#F5ECD7] hover:border-[#C9A84C]/50"}`}
                    onClick={() => setViewEntry(viewEntry?.id === entry.id ? null : entry)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#0F1B3D] text-sm">{entry.date}</p>
                        {entry.mood && <p className="text-xs text-gray-500 font-sans mt-0.5">{entry.mood}</p>}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {viewEntry?.id === entry.id && (
                      <div className="mt-3 pt-3 border-t border-[#F5ECD7] space-y-2 text-xs text-gray-600 font-sans">
                        {entry.verseReference && (
                          <p className="text-[#8B6914] italic">{entry.verseReference}</p>
                        )}
                        {entry.gratitude && (
                          <div><p className="font-semibold text-[#0F1B3D] mb-0.5">Gratitude:</p><p>{entry.gratitude}</p></div>
                        )}
                        {entry.reflection && (
                          <div><p className="font-semibold text-[#0F1B3D] mb-0.5">Reflection:</p><p>{entry.reflection}</p></div>
                        )}
                        {entry.prayer && (
                          <div><p className="font-semibold text-[#0F1B3D] mb-0.5">Prayer:</p><p>{entry.prayer}</p></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Streak card */}
            <div className="mt-6 bg-gradient-to-br from-[#C9A84C]/20 to-[#F0D27C]/10 rounded-2xl border border-[#C9A84C]/30 p-5 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <p className="font-bold text-[#0F1B3D] mb-1">{Math.max(1, entries.length)}-Day Streak</p>
              <p className="text-xs text-gray-500 font-sans">Keep journaling to build your faith record</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
