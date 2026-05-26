"use client";

import { useState } from "react";
import { Star, Trophy, RefreshCw, Check, X } from "lucide-react";
import { kidsVerses } from "@/data/verses";

const MEMORY_GAMES = kidsVerses.map(v => ({
  verse: v,
  options: [v.reference, ...kidsVerses.filter(k => k.reference !== v.reference).slice(0, 3).map(k => k.reference)].sort(() => Math.random() - 0.5),
}));

const AFFIRMATIONS_KIDS = [
  { text: "I am loved by God!", emoji: "❤️", color: "bg-red-100 border-red-200" },
  { text: "God made me special!", emoji: "⭐", color: "bg-yellow-100 border-yellow-200" },
  { text: "I can do hard things with God's help!", emoji: "💪", color: "bg-blue-100 border-blue-200" },
  { text: "I am brave because God is with me!", emoji: "🦁", color: "bg-orange-100 border-orange-200" },
  { text: "God hears every prayer I pray!", emoji: "🙏", color: "bg-purple-100 border-purple-200" },
  { text: "I am a child of the King!", emoji: "👑", color: "bg-pink-100 border-pink-200" },
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-8 sm:py-12 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["⭐", "✨", "🌟", "💫"].map((star, i) => (
            <span key={i} className="absolute text-2xl opacity-40 gentle-pulse" style={{ left: `${25 * i}%`, top: `${20 + (i % 3) * 20}%`, animationDelay: `${i * 0.5}s` }}>{star}</span>
          ))}
        </div>
        <div className="relative z-10">
          <div className="text-4xl sm:text-6xl mb-3">🌈</div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1">Kids Bible Corner!</h1>
          <p className="text-yellow-100 font-sans text-sm sm:text-base">Learn God&apos;s Word, earn badges, and grow in faith!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Score & Badges */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <div className="bg-white rounded-2xl border-2 border-yellow-200 px-6 py-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500">{score}</div>
            <div className="text-sm text-gray-500 font-sans">Points Earned</div>
          </div>
          {badges.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-yellow-200 px-6 py-4 shadow-sm">
              <div className="text-xs text-gray-500 font-sans mb-2">My Badges:</div>
              <div className="flex flex-wrap gap-2">
                {badges.map(b => (
                  <span key={b} className="bg-yellow-100 border border-yellow-200 rounded-full px-3 py-1 text-sm">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Memory Game */}
          <div>
            <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <Trophy size={22} />
              Bible Memory Game
            </h2>

            <div className="bg-white rounded-3xl border-2 border-yellow-200 shadow-md p-6 mb-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📖</div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-5 mb-4 border border-yellow-200">
                  <p className="text-[#2C1810] text-lg leading-relaxed font-medium">
                    {currentGame.verse.simpleText}
                  </p>
                </div>
                <p className="text-gray-500 font-sans text-sm">Which verse is this from?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {currentGame.options.map(option => (
                  <button
                    key={option}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm font-semibold font-sans transition-all ${
                      !selectedAnswer ? "border-yellow-200 bg-yellow-50 hover:border-orange-300 hover:bg-orange-50" :
                      option === currentGame.verse.reference ? "border-green-400 bg-green-100 text-green-700" :
                      option === selectedAnswer ? "border-red-400 bg-red-100 text-red-700" :
                      "border-gray-200 bg-gray-50 text-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer && (
                <div className={`rounded-2xl p-4 text-center mb-4 ${isCorrect ? "bg-green-100 border border-green-200" : "bg-orange-100 border border-orange-200"}`}>
                  <div className="text-2xl mb-1">{isCorrect ? "🎉" : "💪"}</div>
                  <p className={`font-bold text-sm ${isCorrect ? "text-green-700" : "text-orange-700"}`}>
                    {isCorrect ? "Great job! You got it right!" : `The answer is ${currentGame.verse.reference}`}
                  </p>
                  <p className="text-xs text-gray-500 font-sans mt-1 italic">&ldquo;{currentGame.verse.text}&rdquo;</p>
                </div>
              )}

              {selectedAnswer && (
                <button
                  onClick={nextGame}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold font-sans hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Next Verse!
                </button>
              )}
            </div>

            {/* Kids Affirmations */}
            <div className={`rounded-3xl border-2 p-6 ${AFFIRMATIONS_KIDS[affirmationIndex].color}`}>
              <div className="text-center">
                <div className="text-5xl mb-3">{AFFIRMATIONS_KIDS[affirmationIndex].emoji}</div>
                <p className="text-2xl font-bold text-[#2C1810] mb-4">{AFFIRMATIONS_KIDS[affirmationIndex].text}</p>
                <button
                  onClick={() => setAffirmationIndex(i => (i + 1) % AFFIRMATIONS_KIDS.length)}
                  className="px-5 py-2 rounded-full bg-white border-2 border-current text-[#0F1B3D] font-sans font-semibold text-sm hover:shadow-md transition-all"
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
              <h2 className="text-2xl font-bold text-orange-600 mb-4">🌙 Bedtime Bible Stories</h2>
              <div className="space-y-3">
                {BEDTIME_STORIES.map((story, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl border-2 border-yellow-100 overflow-hidden cursor-pointer transition-all ${activeStory === i ? "border-orange-300 shadow-md" : "hover:border-yellow-300"}`}
                    onClick={() => setActiveStory(activeStory === i ? null : i)}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <span className="text-3xl">{story.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0F1B3D]">{story.title}</h3>
                      </div>
                      <span className="text-gray-300">{activeStory === i ? "▲" : "▼"}</span>
                    </div>
                    {activeStory === i && (
                      <div className="px-4 pb-4 border-t border-yellow-100">
                        <p className="text-gray-600 font-sans text-sm leading-relaxed my-3">{story.summary}</p>
                        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                          <p className="text-sm italic text-[#2C1810]">&ldquo;{story.verse}&rdquo;</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Bible verses */}
            <div>
              <h2 className="text-xl font-bold text-orange-600 mb-3">📖 Kid-Friendly Verses</h2>
              <div className="space-y-3">
                {kidsVerses.slice(0, 5).map(v => (
                  <div key={v.reference} className="bg-white rounded-2xl border-2 border-yellow-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center text-lg flex-shrink-0">
                        ✝️
                      </div>
                      <div>
                        <p className="font-bold text-[#0F1B3D] text-sm">{v.simpleText}</p>
                        <p className="text-orange-500 text-xs font-sans font-semibold">{v.reference}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent note */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Star size={15} />
                Parent&apos;s Corner
              </h3>
              <p className="text-blue-600 font-sans text-sm leading-relaxed">
                Help your child build lasting faith by making scripture memory fun! Celebrate each verse they learn and watch their confidence in God grow. &ldquo;Train up a child in the way he should go.&rdquo; — Proverbs 22:6
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
