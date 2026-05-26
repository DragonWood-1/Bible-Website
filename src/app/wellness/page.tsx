"use client";

import { useState } from "react";
import { wellnessTopics } from "@/data/verses";
import { BookOpen, Bookmark, Wind } from "lucide-react";

export default function WellnessPage() {
  const [activeTopic, setActiveTopic] = useState(wellnessTopics[0]);
  const [verseIndex, setVerseIndex] = useState(0);
  const [savedVerses, setSavedVerses] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("savedVerses");
      return s ? JSON.parse(s) : [];
    }
    return [];
  });
  const [breatheActive, setBreatheActive] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [breatheSeconds, setBreatheSeconds] = useState(4);

  function handleSave(reference: string) {
    setSavedVerses(prev => {
      const updated = prev.includes(reference) ? prev.filter(r => r !== reference) : [...prev, reference];
      localStorage.setItem("savedVerses", JSON.stringify(updated));
      return updated;
    });
  }

  function startBreathing() {
    setBreatheActive(true);
    const phases: Array<{ phase: "inhale" | "hold" | "exhale" | "rest"; seconds: number }> = [
      { phase: "inhale", seconds: 4 },
      { phase: "hold", seconds: 4 },
      { phase: "exhale", seconds: 6 },
      { phase: "rest", seconds: 2 },
    ];
    let phaseIdx = 0;
    let remaining = phases[0].seconds;
    setBreathePhase(phases[0].phase);
    setBreatheSeconds(remaining);

    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        remaining = phases[phaseIdx].seconds;
        setBreathePhase(phases[phaseIdx].phase);
      }
      setBreatheSeconds(remaining);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setBreatheActive(false);
    }, 60000);
  }

  const currentVerse = activeTopic.verses[verseIndex % activeTopic.verses.length];

  const phaseMessages = {
    inhale: "Breathe In God's Peace",
    hold: "Hold — Rest in Him",
    exhale: "Release Every Worry",
    rest: "Be Still & Know",
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="hero-bg py-10 sm:py-14 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Christian Mental Wellness</h1>
          <p className="text-gray-300 font-sans text-sm sm:text-base">Biblical encouragement for life&apos;s hardest seasons. You are not alone — God is with you.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Topic selector */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {wellnessTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => { setActiveTopic(topic); setVerseIndex(0); }}
              className={`p-3 sm:p-4 rounded-2xl text-center transition-all border-2 ${activeTopic.id === topic.id ? "border-[#C9A84C] bg-[#C9A84C]/10 shadow-md scale-105" : "border-[#F5ECD7] bg-white hover:border-[#C9A84C]/50"}`}
            >
              <div className="text-xl sm:text-2xl mb-1">{topic.icon}</div>
              <div className="text-xs sm:text-sm font-sans font-medium text-[#0F1B3D]">{topic.label}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic intro */}
            <div className={`rounded-2xl p-6 bg-gradient-to-r ${activeTopic.color} text-white`}>
              <div className="text-4xl mb-3">{activeTopic.icon}</div>
              <h2 className="text-2xl font-bold mb-2">Dealing with {activeTopic.label}</h2>
              <p className="text-white/90 font-sans">{activeTopic.description}</p>
            </div>

            {/* Affirmation */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] p-6 shadow-sm">
              <p className="text-[#8B6914] text-xs font-sans uppercase tracking-wide mb-3">Faith Affirmation</p>
              <p className="text-xl text-[#2C1810] italic leading-relaxed">&ldquo;{activeTopic.affirmation}&rdquo;</p>
            </div>

            {/* Scriptures */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#0F1B3D] flex items-center gap-2">
                <BookOpen size={16} />
                Scriptures for {activeTopic.label}
              </h3>
              {activeTopic.verses.slice(0, 5).map((verse, i) => (
                <div key={verse.reference} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${verseIndex === i ? "border-[#C9A84C] shadow-md" : "border-[#F5ECD7]"}`}>
                  <blockquote className="text-[#2C1810] italic leading-relaxed mb-3">
                    &ldquo;{verse.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <p className="text-[#8B6914] font-semibold font-sans text-sm">{verse.reference}</p>
                    <button
                      onClick={() => handleSave(verse.reference)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans transition-all ${savedVerses.includes(verse.reference) ? "bg-[#C9A84C] text-white" : "bg-[#FDF8F0] border border-[#F5ECD7] text-gray-500 hover:border-[#C9A84C]"}`}
                    >
                      <Bookmark size={11} className={savedVerses.includes(verse.reference) ? "fill-current" : ""} />
                      {savedVerses.includes(verse.reference) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Journal prompt */}
            <div className="bg-[#FDF8F0] rounded-2xl border border-[#F5ECD7] p-6">
              <h3 className="font-bold text-[#0F1B3D] mb-3">📝 Reflection Prompt</h3>
              <p className="text-gray-600 font-sans text-sm mb-4">
                {activeTopic.id === "anxiety" && "What specific worry am I carrying today? What would it look like to place it in God's hands?"}
                {activeTopic.id === "depression" && "What is one thing I am grateful for today, no matter how small? How can I see God at work in my life?"}
                {activeTopic.id === "loneliness" && "How has God shown His presence to me this week? What Scripture can I hold onto when I feel alone?"}
                {activeTopic.id === "grief" && "What do I most want God to know about how I'm feeling? How can I allow myself to grieve while trusting His care?"}
                {activeTopic.id === "confidence" && "What does God's Word say about my identity and worth? How can I start believing it more deeply today?"}
                {activeTopic.id === "motivation" && "What God-given purpose drives me? What small step can I take today to move toward it?"}
              </p>
              <textarea
                placeholder="Write your reflection here..."
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F5ECD7] bg-white font-sans text-sm text-[#2C1810] resize-none focus:outline-none focus:border-[#C9A84C] transition-colors"
                rows={4}
              />
              <button className="mt-3 px-5 py-2 rounded-full bg-[#0F1B3D] text-[#F0D27C] text-sm font-sans hover:bg-[#1E3A6E] transition-colors">
                Save to Journal
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Breathing exercise */}
            {activeTopic.breathing && (
              <div className="bg-white rounded-2xl border border-[#F5ECD7] p-6 shadow-sm text-center">
                <h3 className="font-bold text-[#0F1B3D] mb-2 flex items-center justify-center gap-2">
                  <Wind size={16} />
                  Breathing Exercise
                </h3>
                <p className="text-xs text-gray-500 font-sans mb-4">Box breathing to calm anxiety with God&apos;s peace</p>

                {breatheActive ? (
                  <div>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center breathe">
                      <span className="text-2xl font-bold text-white">{breatheSeconds}</span>
                    </div>
                    <p className="text-[#0F1B3D] font-semibold mb-1">{phaseMessages[breathePhase]}</p>
                    <p className="text-xs text-gray-400 font-sans capitalize">{breathePhase}...</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 flex items-center justify-center">
                      <Wind size={28} className="text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-sans mb-4">
                      &ldquo;Be still, and know that I am God.&rdquo;<br />
                      <span className="text-[#8B6914]">Psalm 46:10</span>
                    </p>
                    <button
                      onClick={startBreathing}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-sans font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                      Start Breathing Exercise
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick prayer */}
            <div className="bg-gradient-to-br from-[#0F1B3D] to-[#3D1F6E] rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">🙏 Quick Prayer</h3>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                {activeTopic.id === "anxiety" && "Lord, I give You every anxious thought. Fill me with Your perfect peace that passes all understanding."}
                {activeTopic.id === "depression" && "Father, lift me from this darkness. Let Your light shine on me and renew my joy and hope."}
                {activeTopic.id === "loneliness" && "God, remind me that You are always near. You know my name and You hold me close."}
                {activeTopic.id === "grief" && "Comforter, hold me close as I grieve. Wipe my tears and give me the hope of Your promises."}
                {activeTopic.id === "confidence" && "Lord, help me see myself through Your eyes — fearfully and wonderfully made for a purpose."}
                {activeTopic.id === "motivation" && "Father, reignite the fire You placed in me. Guide my steps and let everything I do bring glory to You."}
              </p>
              <p className="text-[#F0D27C] text-xs font-sans mt-3">Amen.</p>
            </div>

            {/* Resource links */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] p-5 shadow-sm">
              <h3 className="font-bold text-[#0F1B3D] mb-3 text-sm">More Resources</h3>
              <ul className="space-y-2 text-sm font-sans">
                {[
                  { emoji: "🤖", label: "AI Encouragement Chat", href: "/encouragement" },
                  { emoji: "📖", label: "Scripture Library", href: "/verses" },
                  { emoji: "📝", label: "Reflection Journal", href: "/journal" },
                  { emoji: "🌙", label: "Sleep Meditation", href: "/meditation" },
                ].map(item => (
                  <li key={item.href}>
                    <a href={item.href} className="flex items-center gap-2 text-gray-600 hover:text-[#8B6914] transition-colors">
                      <span>{item.emoji}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Crisis line */}
            <div className="bg-red-50 rounded-2xl border border-red-100 p-4 text-center">
              <p className="text-xs text-red-700 font-sans leading-relaxed">
                If you are in crisis, please call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline) or reach out to a trusted pastor or counselor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
