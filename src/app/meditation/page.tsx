"use client";

import { useState } from "react";
import { Play, Pause, Moon, Star, Wind, Music } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { sleepScriptures } from "@/data/verses";

const SESSIONS = [
  {
    id: "sleep",
    title: "Scripture Sleep",
    icon: Moon,
    duration: "20 min",
    desc: "Drift into peaceful rest with calming Bible passages and gentle narration.",
    accent: "text-indigo-400",
    bg: "bg-indigo-950/40 border-indigo-900/50",
  },
  {
    id: "morning",
    title: "Morning Awakening",
    icon: Star,
    duration: "10 min",
    desc: "Start your day with an uplifting scripture meditation and affirmation.",
    accent: "text-amber-400",
    bg: "bg-amber-950/40 border-amber-900/50",
  },
  {
    id: "anxiety",
    title: "Peace for Anxiety",
    icon: Wind,
    duration: "15 min",
    desc: "Box breathing with Psalm 46 and calming scripture to quiet anxious thoughts.",
    accent: "text-cyan-400",
    bg: "bg-cyan-950/40 border-cyan-900/50",
  },
  {
    id: "worship",
    title: "Worship & Gratitude",
    icon: Music,
    duration: "12 min",
    desc: "Psalms of praise with gentle instrumental music to lift your spirit.",
    accent: "text-rose-400",
    bg: "bg-rose-950/40 border-rose-900/50",
  },
];

const GUIDED_TEXTS: Record<string, string[]> = {
  sleep: [
    "Find a comfortable position and close your eyes.",
    "Take a slow, deep breath in... and breathe out gently.",
    "\"In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.\" — Psalm 4:8",
    "Allow God's peace to wash over your body like a warm light.",
    "\"He grants sleep to those he loves.\" — Psalm 127:2",
    "Release every thought and every worry to God right now.",
    "\"Cast your cares on the Lord and he will sustain you.\" — Psalm 55:22",
    "You are held. You are safe. You are loved. Rest now in His care.",
  ],
  morning: [
    "Open your heart to this new day — a gift from God.",
    "\"This is the day the Lord has made; let us rejoice and be glad in it.\" — Psalm 118:24",
    "Take three deep, grateful breaths.",
    "\"The Lord's mercies are new every morning. Great is His faithfulness.\" — Lamentations 3:22-23",
    "Speak this affirmation aloud: I am equipped for today. God goes before me.",
    "\"I can do all things through Christ who strengthens me.\" — Philippians 4:13",
    "You are ready. You are covered. Go and shine God's light today.",
  ],
  anxiety: [
    "Place one hand on your heart. Feel it beating — God sustains you.",
    "Breathe in for 4 counts... hold for 4... breathe out for 6...",
    "\"Do not be anxious about anything, but in every situation, present your requests to God.\" — Philippians 4:6",
    "Breathe in for 4 counts... hold for 4... breathe out for 6...",
    "\"And the peace of God, which transcends all understanding, will guard your hearts and minds.\" — Philippians 4:7",
    "Breathe in for 4 counts... hold for 4... breathe out for 6...",
    "\"Be still, and know that I am God.\" — Psalm 46:10",
    "You are safe. God is with you right now. Rest in His presence.",
  ],
  worship: [
    "Open your heart and hands in gratitude.",
    "\"Praise the Lord, my soul; all my inmost being, praise his holy name.\" — Psalm 103:1",
    "Think of one blessing from today — no matter how small.",
    "\"Give thanks to the Lord, for he is good; his love endures forever.\" — Psalm 107:1",
    "\"The Lord your God is with you, the Mighty Warrior who saves. He will rejoice over you with singing.\" — Zephaniah 3:17",
    "You are deeply loved. You are known. You are cherished by God Himself.",
    "Sit in His presence for a moment longer... just breathing in His goodness.",
  ],
};

export default function MeditationPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  function startSession(id: string) {
    setActiveSession(id);
    setPlaying(true);
    setTextIndex(0);
    playSession(id);
  }

  function playSession(id: string) {
    let idx = 0;
    const texts = GUIDED_TEXTS[id] || [];
    const interval = setInterval(() => {
      idx++;
      if (idx >= texts.length) {
        clearInterval(interval);
        setPlaying(false);
        return;
      }
      setTextIndex(idx);
    }, 5000);
    setTimer(interval);
  }

  function stopSession() {
    if (timer) clearInterval(timer);
    setPlaying(false);
    setActiveSession(null);
    setTextIndex(0);
  }

  const currentTexts = activeSession ? GUIDED_TEXTS[activeSession] : [];

  return (
    <div className="min-h-screen bg-[#1C1008]">
      <PageHeader
        eyebrow="Meditation"
        title="Scripture Meditation"
        subtitle="Guided biblical sessions for sleep, morning, anxiety, and praise. Let God's Word still your soul."
      />

      {/* Active session overlay */}
      {activeSession && (
        <div className="max-w-lg mx-auto px-4 sm:px-6 mb-10">
          <div className="bg-[#F8F0DC]/5 border border-[#9D7A2C]/30 rounded-xl p-5 sm:p-8 text-center">
            <div className="flex justify-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="audio-bar" style={{ animationDelay: `${i * 0.15}s`, height: `${20 + i * 10}%`, opacity: playing ? 1 : 0.3 }} />
              ))}
            </div>

            <p className="text-[#F5EDD5] font-serif text-lg leading-relaxed italic mb-6 min-h-[80px] transition-all duration-700">
              {currentTexts[textIndex]}
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {currentTexts.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === textIndex ? "bg-[#9D7A2C] scale-125" : "bg-[#F8F0DC]/20"}`} />
              ))}
            </div>

            <button
              onClick={stopSession}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-[#F8F0DC]/10 border border-[#9D7A2C]/30 text-[#F5EDD5] font-sans text-sm hover:bg-[#F8F0DC]/20 transition-all"
            >
              <Pause size={14} />
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Sessions */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-10 sm:mb-12">
          {SESSIONS.map((session) => {
            const Icon = session.icon;
            return (
              <button
                key={session.id}
                onClick={() => activeSession === session.id ? stopSession() : startSession(session.id)}
                className={`${session.bg} border rounded-xl p-6 text-left transition-all hover:border-[#9D7A2C]/60 ${activeSession === session.id ? "ring-1 ring-[#9D7A2C]" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={22} className={session.accent} />
                  <span className="text-xs text-[#9D7A2C] font-sans bg-[#F8F0DC]/5 px-2 py-0.5 rounded-full border border-[#9D7A2C]/20">
                    {session.duration}
                  </span>
                </div>
                <h3 className="font-serif text-[#F5EDD5] mb-2">{session.title}</h3>
                <p className="text-sm text-[#C8B888]/70 font-serif leading-relaxed mb-4">{session.desc}</p>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border border-[#9D7A2C]/30 text-[#9D7A2C] text-sm font-sans w-fit`}>
                  {activeSession === session.id ? <><Pause size={13} /> Stop</> : <><Play size={13} /> Begin</>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sleep scriptures */}
        <div className="bg-[#F8F0DC]/5 border border-[#9D7A2C]/20 rounded-xl p-8">
          <h2 className="text-[#F5EDD5] font-serif text-xl mb-6 flex items-center gap-2">
            <Moon size={18} className="text-[#9D7A2C]" />
            Sleep Scriptures
          </h2>
          <div className="space-y-5">
            {sleepScriptures.map((v) => (
              <div key={v.reference} className="border-b border-[#9D7A2C]/15 pb-5 last:border-0 last:pb-0">
                <blockquote className="verse-text text-[#C8B888] leading-relaxed mb-2">&ldquo;{v.text}&rdquo;</blockquote>
                <p className="verse-ref text-[#9D7A2C]">{v.reference}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
