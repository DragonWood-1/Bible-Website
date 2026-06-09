"use client";

import { useState } from "react";
import { wellnessTopics } from "@/data/verses";
import { BookOpen, Bookmark, Wind } from "lucide-react";
import PageHeader from "@/components/PageHeader";

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
  void currentVerse;

  const phaseMessages = {
    inhale: "Breathe In God's Peace",
    hold: "Hold — Rest in Him",
    exhale: "Release Every Worry",
    rest: "Be Still & Know",
  };

  return (
    <div className="min-h-screen bg-[#F8F0DC]">
      <PageHeader
        eyebrow="Wellness"
        title="Biblical Mental Wellness"
        subtitle="Encouragement for life's hardest seasons. You are not alone — God is with you."
      />
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

        {/* Topic selector */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {wellnessTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => { setActiveTopic(topic); setVerseIndex(0); }}
              className={`p-3 sm:p-4 rounded-xl text-center transition-all border ${
                activeTopic.id === topic.id
                  ? "border-[#9D7A2C] bg-[#EDE0BF] shadow-md"
                  : "parchment-card hover:border-[#9D7A2C]"
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1">{topic.icon}</div>
              <div className="text-xs sm:text-sm font-serif text-[#1A0800]">{topic.label}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Topic intro */}
            <div className="bg-[#6B1A1A] rounded-xl p-6 border border-[#8B2424]">
              <div className="text-4xl mb-3">{activeTopic.icon}</div>
              <h2 className="text-2xl font-serif text-[#F5EDD5] mb-2">Dealing with {activeTopic.label}</h2>
              <p className="text-[#C8B888]/80 font-serif leading-relaxed">{activeTopic.description}</p>
            </div>

            {/* Affirmation */}
            <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-6">
              <p className="text-[#9D7A2C] text-xs font-sans uppercase tracking-widest mb-3"
                 style={{ fontVariant: "small-caps" }}>Faith Affirmation</p>
              <p className="text-xl text-[#1A0800] font-serif italic leading-relaxed">&ldquo;{activeTopic.affirmation}&rdquo;</p>
            </div>

            {/* Scriptures */}
            <div className="space-y-4">
              <h3 className="font-serif text-[#1A0800] text-lg flex items-center gap-2">
                <BookOpen size={16} className="text-[#9D7A2C]" />
                Scriptures for {activeTopic.label}
              </h3>
              {activeTopic.verses.slice(0, 5).map((verse, i) => (
                <div
                  key={verse.reference}
                  className={`parchment-card card-lift rounded-xl p-5 transition-all ${
                    verseIndex === i ? "border-[#9D7A2C]" : ""
                  }`}
                >
                  <blockquote className="verse-text text-[#1A0800] leading-relaxed mb-3">
                    &ldquo;{verse.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <p className="verse-ref text-[#9D7A2C] text-sm">{verse.reference}</p>
                    <button
                      onClick={() => handleSave(verse.reference)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
                        savedVerses.includes(verse.reference)
                          ? "btn-gold"
                          : "btn-outline"
                      }`}
                    >
                      <Bookmark size={11} className={savedVerses.includes(verse.reference) ? "fill-current" : ""} />
                      {savedVerses.includes(verse.reference) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Journal prompt */}
            <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-6">
              <h3 className="font-serif text-[#1A0800] text-lg mb-3">Reflection Prompt</h3>
              <p className="text-[#4A2800] font-serif text-sm mb-4 leading-relaxed">
                {activeTopic.id === "anxiety" && "What specific worry am I carrying today? What would it look like to place it in God's hands?"}
                {activeTopic.id === "depression" && "What is one thing I am grateful for today, no matter how small? How can I see God at work in my life?"}
                {activeTopic.id === "loneliness" && "How has God shown His presence to me this week? What Scripture can I hold onto when I feel alone?"}
                {activeTopic.id === "grief" && "What do I most want God to know about how I'm feeling? How can I allow myself to grieve while trusting His care?"}
                {activeTopic.id === "confidence" && "What does God's Word say about my identity and worth? How can I start believing it more deeply today?"}
                {activeTopic.id === "motivation" && "What God-given purpose drives me? What small step can I take today to move toward it?"}
              </p>
              <textarea
                placeholder="Write your reflection here..."
                className="w-full px-4 py-3 rounded-xl border border-[#DCCFA0] bg-[#F8F0DC] font-serif text-sm text-[#1A0800] resize-none focus:outline-none focus:border-[#9D7A2C] transition-colors"
                rows={4}
              />
              <button className="mt-3 px-5 py-2 rounded-lg btn-primary text-sm font-sans">
                Save to Journal
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Breathing exercise */}
            {activeTopic.breathing && (
              <div className="parchment-card rounded-xl p-6 text-center">
                <h3 className="font-serif text-[#1A0800] text-lg mb-2 flex items-center justify-center gap-2">
                  <Wind size={16} className="text-[#9D7A2C]" />
                  Breathing Exercise
                </h3>
                <p className="text-xs text-[#7A5020] font-sans mb-4">Box breathing to calm anxiety with God&apos;s peace</p>

                {breatheActive ? (
                  <div>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#6B1A1A] border border-[#8B2424] flex items-center justify-center breathe">
                      <span className="text-2xl font-serif font-bold text-[#F5EDD5]">{breatheSeconds}</span>
                    </div>
                    <p className="text-[#1A0800] font-serif mb-1">{phaseMessages[breathePhase]}</p>
                    <p className="text-xs text-[#7A5020] font-sans capitalize">{breathePhase}...</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#EDE0BF] border border-[#DCCFA0] flex items-center justify-center">
                      <Wind size={28} className="text-[#9D7A2C]" />
                    </div>
                    <p className="text-sm text-[#4A2800] font-serif mb-4 italic">
                      &ldquo;Be still, and know that I am God.&rdquo;<br />
                      <span className="verse-ref">Psalm 46:10</span>
                    </p>
                    <button
                      onClick={startBreathing}
                      className="w-full py-3 rounded-lg btn-primary text-sm font-sans"
                    >
                      Start Breathing Exercise
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick prayer */}
            <div className="bg-[#1C1008] border border-[#9D7A2C]/30 rounded-xl p-6">
              <h3 className="font-serif text-[#F5EDD5] text-lg mb-3">Quick Prayer</h3>
              <p className="text-sm text-[#C8B888]/80 font-serif leading-relaxed italic">
                {activeTopic.id === "anxiety" && "Lord, I give You every anxious thought. Fill me with Your perfect peace that passes all understanding."}
                {activeTopic.id === "depression" && "Father, lift me from this darkness. Let Your light shine on me and renew my joy and hope."}
                {activeTopic.id === "loneliness" && "God, remind me that You are always near. You know my name and You hold me close."}
                {activeTopic.id === "grief" && "Comforter, hold me close as I grieve. Wipe my tears and give me the hope of Your promises."}
                {activeTopic.id === "confidence" && "Lord, help me see myself through Your eyes — fearfully and wonderfully made for a purpose."}
                {activeTopic.id === "motivation" && "Father, reignite the fire You placed in me. Guide my steps and let everything I do bring glory to You."}
              </p>
              <p className="text-[#9D7A2C] text-xs font-sans mt-3">Amen.</p>
            </div>

            {/* Resource links */}
            <div className="parchment-card rounded-xl p-5">
              <h3 className="font-serif text-[#1A0800] mb-3">More Resources</h3>
              <ul className="space-y-2 text-sm font-serif">
                {[
                  { emoji: "🤖", label: "AI Encouragement Chat", href: "/encouragement" },
                  { emoji: "📖", label: "Scripture Library", href: "/verses" },
                  { emoji: "📝", label: "Reflection Journal", href: "/journal" },
                  { emoji: "🌙", label: "Sleep Meditation", href: "/meditation" },
                ].map(item => (
                  <li key={item.href}>
                    <a href={item.href} className="flex items-center gap-2 text-[#4A2800] hover:text-[#9D7A2C] transition-colors">
                      <span>{item.emoji}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Crisis line */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
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
