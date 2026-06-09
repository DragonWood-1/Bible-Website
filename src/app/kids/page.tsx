"use client";

import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { kidsVerses } from "@/data/verses";

const MEMORY_GAMES = kidsVerses.map(v => ({
  verse: v,
  options: [v.reference, ...kidsVerses.filter(k => k.reference !== v.reference).slice(0, 3).map(k => k.reference)].sort(() => Math.random() - 0.5),
}));

const AFFIRMATIONS_KIDS = [
  { text: "I am loved by God!", emoji: "❤️", color: "bg-red-50 border-red-200" },
  { text: "God made me special!", emoji: "⭐", color: "bg-yellow-50 border-yellow-200" },
  { text: "I can do hard things with God's help!", emoji: "💪", color: "bg-blue-50 border-blue-200" },
  { text: "I am brave because God is with me!", emoji: "🦁", color: "bg-orange-50 border-orange-200" },
  { text: "God hears every prayer I pray!", emoji: "🙏", color: "bg-purple-50 border-purple-200" },
  { text: "I am a child of the King!", emoji: "👑", color: "bg-pink-50 border-pink-200" },
];

const BEDTIME_STORIES = [
  { title: "David and the Giant", emoji: "🪨", summary: "A young boy trusted God and defeated a giant everyone else feared. You can face your giants with God too!", verse: "I can do all things through Christ who strengthens me. — Philippians 4:13" },
  { title: "Noah and the Rainbow", emoji: "🌈", summary: "Noah obeyed God even when it seemed silly. God kept every promise He made. He keeps His promises to you too!", verse: "God's promises are yes and amen! — 2 Corinthians 1:20" },
  { title: "The Good Shepherd", emoji: "🐑", summary: "Jesus is like a good shepherd who knows every sheep by name. He knows YOUR name and loves you so much!", verse: "The Lord is my shepherd; I shall not want. — Psalm 23:1" },
  { title: "Daniel in the Lions Den", emoji: "🦁", summary: "Daniel prayed to God even when it was scary. God sent His angel to protect Daniel. God protects you too!", verse: "Do not fear, for I am with you. — Isaiah 41:10" },
];

export default function KidsPage() {
  const [gameIndex, setGameIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const currentGame = MEMORY_GAMES[gameIndex % MEMORY_GAMES.length];
  const isCorrect = selectedAnswer === currentGame.verse.reference;

  function handleAnswer(answer: string) {
    setSelectedAnswer(answer);
    if (answer === currentGame.verse.reference) {
      setScore(s => s + 1);
      const newBadges: string[] = [];
      if (score + 1 === 3 && !badges.includes("🌟")) newBadges.push("🌟 Star Learner");
      if (score + 1 === 5 && !badges.includes("🏆")) newBadges.push("🏆 Scripture Hero");
      if (score + 1 === 8 && !badges.includes("👑")) newBadges.push("👑 Bible Champion");
      if (newBadges.length) setBadges(prev => [...prev, ...newBadges]);
    }
  }

  function nextGame() {
    setGameIndex(i => i + 1);
    setSelectedAnswer(null);
  }

  return (
    <div className="min-h-screen bg-[#F8F0DC]">
      <PageHeader
        eyebrow="Children"
        title="Kids Bible Corner"
        subtitle="Memory games, bedtime stories, and affirmations to help children grow in faith."
      />

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

        {/* Score & Badges */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <div className="parchment-card rounded-xl px-6 py-4 text-center">
            <div className="text-3xl font-serif text-[#6B1A1A]">{score}</div>
            <div className="text-sm text-[#7A5020] font-sans">Points Earned</div>
          </div>
          {badges.length > 0 && (
            <div className="parchment-card rounded-xl px-6 py-4">
              <div className="text-xs text-[#7A5020] font-sans mb-2">My Badges:</div>
              <div className="flex flex-wrap gap-2">
                {badges.map(b => (
                  <span key={b} className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-full px-3 py-1 text-sm font-serif">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Memory Game */}
          <div>
            <h2 className="text-2xl font-serif text-[#6B1A1A] mb-4 flex items-center gap-2">
              <Trophy size={22} className="text-[#9D7A2C]" />
              Bible Memory Game
            </h2>

            <div className="parchment-card rounded-xl p-6 mb-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📖</div>
                <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-5 mb-4">
                  <p className="verse-text text-[#1A0800] text-lg leading-relaxed">
                    {currentGame.verse.simpleText}
                  </p>
                </div>
                <p className="text-[#7A5020] font-sans text-sm">Which verse is this from?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {currentGame.options.map(option => (
                  <button
                    key={option}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    className={`py-3 px-4 rounded-xl border text-sm font-sans transition-all ${
                      !selectedAnswer
                        ? "border-[#DCCFA0] bg-[#EDE0BF] hover:border-[#9D7A2C] text-[#1A0800]"
                        : option === currentGame.verse.reference
                          ? "border-green-500 bg-green-50 text-green-700"
                          : option === selectedAnswer
                            ? "border-red-400 bg-red-50 text-red-700"
                            : "border-[#DCCFA0] bg-[#F8F0DC] text-[#7A5020]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer && (
                <div className={`rounded-xl p-4 text-center mb-4 border ${
                  isCorrect ? "bg-green-50 border-green-200" : "bg-[#EDE0BF] border-[#DCCFA0]"
                }`}>
                  <div className="text-2xl mb-1">{isCorrect ? "🎉" : "💪"}</div>
                  <p className={`font-serif text-sm ${isCorrect ? "text-green-700" : "text-[#4A2800]"}`}>
                    {isCorrect ? "Great job! You got it right!" : `The answer is ${currentGame.verse.reference}`}
                  </p>
                  <p className="text-xs text-[#7A5020] font-serif mt-1 italic">&ldquo;{currentGame.verse.text}&rdquo;</p>
                </div>
              )}

              {selectedAnswer && (
                <button
                  onClick={nextGame}
                  className="w-full py-3 rounded-xl btn-primary font-sans font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Next Verse!
                </button>
              )}
            </div>

            {/* Kids Affirmations */}
            <div className={`rounded-xl border-2 p-6 ${AFFIRMATIONS_KIDS[affirmationIndex].color}`}>
              <div className="text-center">
                <div className="text-5xl mb-3">{AFFIRMATIONS_KIDS[affirmationIndex].emoji}</div>
                <p className="text-2xl font-serif text-[#1A0800] mb-4">{AFFIRMATIONS_KIDS[affirmationIndex].text}</p>
                <button
                  onClick={() => setAffirmationIndex(i => (i + 1) % AFFIRMATIONS_KIDS.length)}
                  className="px-5 py-2 rounded-full bg-white border border-[#DCCFA0] text-[#1A0800] font-sans font-semibold text-sm hover:shadow-md transition-all"
                >
                  Next Affirmation ✨
                </button>
              </div>
            </div>
          </div>

          {/* Bible Stories & Verses */}
          <div className="space-y-6">

            {/* Bedtime Stories */}
            <div>
              <h2 className="text-2xl font-serif text-[#6B1A1A] mb-4">Bedtime Bible Stories</h2>
              <div className="space-y-3">
                {BEDTIME_STORIES.map((story, i) => (
                  <div
                    key={i}
                    className={`parchment-card rounded-xl overflow-hidden cursor-pointer card-lift ${
                      activeStory === i ? "border-[#9D7A2C]" : ""
                    }`}
                    onClick={() => setActiveStory(activeStory === i ? null : i)}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <span className="text-3xl">{story.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-serif text-[#1A0800]">{story.title}</h3>
                      </div>
                      <span className="text-[#DCCFA0]">{activeStory === i ? "▲" : "▼"}</span>
                    </div>
                    {activeStory === i && (
                      <div className="px-4 pb-4 border-t border-[#DCCFA0]">
                        <p className="text-[#4A2800] font-serif text-sm leading-relaxed my-3">{story.summary}</p>
                        <div className="bg-[#EDE0BF] border border-[#DCCFA0] rounded-xl p-3">
                          <p className="verse-text text-[#1A0800] text-sm">&ldquo;{story.verse}&rdquo;</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Bible verses */}
            <div>
              <h2 className="text-xl font-serif text-[#6B1A1A] mb-3">Kid-Friendly Verses</h2>
              <div className="space-y-3">
                {kidsVerses.slice(0, 5).map(v => (
                  <div key={v.reference} className="parchment-card rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#6B1A1A] border border-[#8B2424] flex items-center justify-center text-lg flex-shrink-0">
                        ✝️
                      </div>
                      <div>
                        <p className="font-serif text-[#1A0800] text-sm">{v.simpleText}</p>
                        <p className="verse-ref text-[#9D7A2C] text-xs mt-0.5">{v.reference}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent note */}
            <div className="bg-[#1C1008] border border-[#9D7A2C]/30 rounded-xl p-5">
              <h3 className="font-serif text-[#F5EDD5] text-lg mb-2">
                Parent&apos;s Corner
              </h3>
              <p className="text-[#C8B888]/80 font-serif text-sm leading-relaxed">
                Help your child build lasting faith by making scripture memory fun! Celebrate each verse they learn and watch their confidence in God grow.
              </p>
              <p className="verse-text text-[#C8B888] text-sm mt-3 italic">&ldquo;Train up a child in the way he should go.&rdquo;</p>
              <p className="verse-ref text-[#9D7A2C] text-xs mt-1">Proverbs 22:6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
