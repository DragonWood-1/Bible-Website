"use client";

import { useState, useEffect } from "react";
import { PenLine, Save, Trash2, Calendar, Sun, Moon, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
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
    <div className="min-h-screen bg-[#F8F0DC]">
      <PageHeader
        eyebrow="Journal"
        title="Reflection Journal"
        subtitle="Record your gratitude, prayers, and the ways God is working in your life."
      />
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Journal form */}
          <div className="lg:col-span-2">

            {/* Date & Verse header */}
            <div className="parchment-card rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EDE0BF] border border-[#DCCFA0] flex items-center justify-center">
                  <TimeIcon size={18} className="text-[#9D7A2C]" />
                </div>
                <div>
                  <p className="font-serif text-[#1A0800]">
                    {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <p className="text-xs text-[#7A5020] font-sans">{isEvening ? "Evening" : "Morning"} reflection</p>
                </div>
              </div>

              <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={13} className="text-[#9D7A2C]" />
                  <span className="text-[#9D7A2C] text-xs font-sans uppercase tracking-widest"
                        style={{ fontVariant: "small-caps" }}>Today&apos;s Verse</span>
                </div>
                <p className="verse-text text-[#1A0800] text-sm leading-relaxed">&ldquo;{todayVerse.text}&rdquo;</p>
                <p className="verse-ref text-[#9D7A2C] text-sm mt-1">{todayVerse.reference}</p>
              </div>
            </div>

            {/* Mood selector */}
            <div className="parchment-card rounded-xl p-6 mb-6">
              <h3 className="font-serif text-[#1A0800] text-lg mb-3 flex items-center gap-2">
                <PenLine size={16} className="text-[#9D7A2C]" />
                How are you feeling today?
              </h3>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m === mood ? "" : m)}
                    className={`px-3 py-1.5 rounded-full text-sm font-sans transition-all mood-btn ${mood === m ? "active" : ""}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude */}
            <div className="parchment-card rounded-xl p-6 mb-6">
              <label className="block font-serif text-[#1A0800] text-lg mb-3">
                Three things I am grateful for
              </label>
              <textarea
                value={gratitude}
                onChange={e => setGratitude(e.target.value)}
                placeholder={"1. \n2. \n3."}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#DCCFA0] font-serif text-sm text-[#1A0800] resize-none focus:outline-none focus:border-[#9D7A2C] transition-colors bg-[#EDE0BF]"
              />
            </div>

            {/* Reflection prompt */}
            <div className="parchment-card rounded-xl p-6 mb-6">
              <label className="block font-serif text-[#1A0800] text-lg mb-1">
                Today&apos;s Reflection
              </label>
              <p className="text-sm text-[#7A5020] font-serif italic mb-3">&ldquo;{todayPrompt}&rdquo;</p>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Write your thoughts, feelings, and what God is speaking to you..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-[#DCCFA0] font-serif text-sm text-[#1A0800] resize-none focus:outline-none focus:border-[#9D7A2C] transition-colors bg-[#EDE0BF]"
              />
            </div>

            {/* Prayer */}
            <div className="parchment-card rounded-xl p-6 mb-6">
              <label className="block font-serif text-[#1A0800] text-lg mb-1">My Prayer Today</label>
              <p className="text-xs text-[#7A5020] font-serif italic mb-3">Starter: &ldquo;{todayPrayer.slice(0, 60)}...&rdquo;</p>
              <textarea
                value={prayer}
                onChange={e => setPrayer(e.target.value)}
                placeholder="Write your personal prayer to God..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[#DCCFA0] font-serif text-sm text-[#1A0800] resize-none focus:outline-none focus:border-[#9D7A2C] transition-colors bg-[#EDE0BF]"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={!gratitude && !reflection && !prayer}
              className={`w-full py-4 rounded-xl font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                saved ? "bg-[#3B7A57] text-white border border-[#3B7A57]" : "btn-primary disabled:opacity-40"
              }`}
            >
              <Save size={16} />
              {saved ? "Journal Entry Saved ✓" : "Save Today's Entry"}
            </button>
          </div>

          {/* Past entries */}
          <div>
            <h2 className="font-serif text-[#1A0800] text-xl mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[#9D7A2C]" />
              Past Entries ({entries.length})
            </h2>

            {entries.length === 0 ? (
              <div className="parchment-card rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">📖</div>
                <p className="text-[#7A5020] font-serif text-sm">Your journal entries will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map(entry => (
                  <div
                    key={entry.id}
                    className={`parchment-card card-lift rounded-xl p-4 cursor-pointer transition-all ${
                      viewEntry?.id === entry.id ? "border-[#9D7A2C]" : ""
                    }`}
                    onClick={() => setViewEntry(viewEntry?.id === entry.id ? null : entry)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-[#1A0800] text-sm">{entry.date}</p>
                        {entry.mood && <p className="text-xs text-[#7A5020] font-sans mt-0.5">{entry.mood}</p>}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                        className="text-[#DCCFA0] hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {viewEntry?.id === entry.id && (
                      <div className="mt-3 pt-3 border-t border-[#DCCFA0] space-y-2 text-xs text-[#4A2800] font-serif">
                        {entry.verseReference && (
                          <p className="verse-ref">{entry.verseReference}</p>
                        )}
                        {entry.gratitude && (
                          <div><p className="font-semibold text-[#1A0800] mb-0.5">Gratitude:</p><p>{entry.gratitude}</p></div>
                        )}
                        {entry.reflection && (
                          <div><p className="font-semibold text-[#1A0800] mb-0.5">Reflection:</p><p>{entry.reflection}</p></div>
                        )}
                        {entry.prayer && (
                          <div><p className="font-semibold text-[#1A0800] mb-0.5">Prayer:</p><p>{entry.prayer}</p></div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Streak card */}
            <div className="mt-6 bg-[#1C1008] border border-[#9D7A2C]/30 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <p className="font-serif text-[#F5EDD5] mb-1">{Math.max(1, entries.length)}-Day Streak</p>
              <p className="text-xs text-[#9D7A2C] font-sans">Keep journaling to build your faith record</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
