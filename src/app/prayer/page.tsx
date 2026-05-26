"use client";

import { useState, useEffect } from "react";
import { Send, Heart, Loader2 } from "lucide-react";
import { prayerPrompts } from "@/data/verses";

interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  category: string;
  date: string;
  prayed: number;
  isAnonymous: boolean;
}

const CATEGORIES = ["🙏 General", "💊 Health", "👨‍👩‍👧 Family", "💼 Career", "❤️ Relationships", "🌱 Spiritual Growth", "💰 Finances", "😰 Anxiety & Peace"];

const SAMPLE_REQUESTS: PrayerRequest[] = [
  { id: "1", name: "Sarah", request: "Please pray for my mother's healing from cancer. We are believing God for a miracle.", category: "💊 Health", date: "2 hours ago", prayed: 47, isAnonymous: false },
  { id: "2", name: "Anonymous", request: "Struggling with my faith right now. Asking God to renew my trust in Him.", category: "🌱 Spiritual Growth", date: "5 hours ago", prayed: 89, isAnonymous: true },
  { id: "3", name: "Marcus", request: "Pray for my job interview tomorrow. Trusting God with the outcome.", category: "💼 Career", date: "1 day ago", prayed: 123, isAnonymous: false },
  { id: "4", name: "Anonymous", request: "My marriage is struggling. Please pray for God to restore what's been broken.", category: "❤️ Relationships", date: "1 day ago", prayed: 201, isAnonymous: true },
  { id: "5", name: "Jennifer", request: "Asking for peace in our home. My teenage son is going through a difficult season.", category: "👨‍👩‍👧 Family", date: "2 days ago", prayed: 156, isAnonymous: false },
];

export default function PrayerPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>(SAMPLE_REQUESTS);
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prayedFor, setPrayedFor] = useState<Set<string>>(new Set());
  const [aiPrayer, setAiPrayer] = useState<string | null>(null);
  const [loadingPrayer, setLoadingPrayer] = useState(false);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyPrayers = [
    prayerPrompts[dayOfYear % prayerPrompts.length],
    prayerPrompts[(dayOfYear + 1) % prayerPrompts.length],
    prayerPrompts[(dayOfYear + 2) % prayerPrompts.length],
  ];

  useEffect(() => {
    const stored = localStorage.getItem("prayerWall");
    if (stored) {
      const userRequests: PrayerRequest[] = JSON.parse(stored);
      setRequests([...userRequests, ...SAMPLE_REQUESTS]);
    }
  }, []);

  function handleSubmit() {
    if (!request.trim()) return;
    const newRequest: PrayerRequest = {
      id: Date.now().toString(),
      name: isAnonymous ? "Anonymous" : (name || "Friend"),
      request: request.trim(),
      category,
      date: "Just now",
      prayed: 0,
      isAnonymous,
    };
    const updated = [newRequest, ...requests];
    setRequests(updated);
    const userRequests = updated.filter(r => !["1","2","3","4","5"].includes(r.id));
    localStorage.setItem("prayerWall", JSON.stringify(userRequests));
    setName(""); setRequest(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handlePray(id: string) {
    if (prayedFor.has(id)) return;
    setPrayedFor(prev => new Set([...prev, id]));
    setRequests(prev => prev.map(r => r.id === id ? { ...r, prayed: r.prayed + 1 } : r));
  }

  async function generatePrayer() {
    setLoadingPrayer(true);
    try {
      const response = await fetch("/api/prayer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: category }) });
      const data = await response.json();
      setAiPrayer(data.prayer);
    } catch {
      setAiPrayer("Lord, we come before You with faith and trust. Hear our prayers and let Your will be done. Guide us by Your Spirit and fill us with Your peace. In Jesus' name, Amen.");
    } finally {
      setLoadingPrayer(false);
    }
  }

  const filtered = filterCat ? requests.filter(r => r.category === filterCat) : requests;

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="hero-bg py-10 sm:py-14 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl sm:text-5xl mb-3">🙏</div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Prayer Wall</h1>
          <p className="text-gray-300 font-sans text-sm sm:text-base">Share your prayer requests and pray for others. Standing together in faith.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Submit + AI prayer */}
          <div className="space-y-6">
            {/* Submit request */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-6">
              <h2 className="font-bold text-[#0F1B3D] mb-4">Share a Prayer Request</h2>

              {!isAnonymous && (
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your first name (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#F5ECD7] font-sans text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A84C] bg-[#FDF8F0] mb-3 transition-colors"
                />
              )}

              <div className="flex flex-wrap gap-1.5 mb-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all border ${category === cat ? "bg-[#C9A84C] text-white border-[#C9A84C]" : "bg-[#FDF8F0] border-[#F5ECD7] text-gray-500 hover:border-[#C9A84C]"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <textarea
                value={request}
                onChange={e => setRequest(e.target.value)}
                placeholder="Share your prayer need..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F5ECD7] font-sans text-sm text-[#2C1810] resize-none focus:outline-none focus:border-[#C9A84C] bg-[#FDF8F0] mb-3 transition-colors"
              />

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-500 font-sans">Post anonymously</span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={!request.trim()}
                className={`w-full py-3 rounded-xl font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all ${submitted ? "bg-green-500 text-white" : "bg-[#0F1B3D] text-[#F0D27C] hover:bg-[#1E3A6E] disabled:opacity-40"}`}
              >
                <Send size={14} />
                {submitted ? "Request Posted! 🙏" : "Post Prayer Request"}
              </button>
            </div>

            {/* AI Prayer Generator */}
            <div className="bg-gradient-to-br from-[#0F1B3D] to-[#3D1F6E] rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">✨ AI Prayer Generator</h3>
              <p className="text-xs text-gray-300 font-sans mb-4">Generate a personalized prayer for your selected category.</p>

              <select
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-sans text-sm mb-3 focus:outline-none"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="text-[#0F1B3D]">{cat}</option>)}
              </select>

              <button
                onClick={generatePrayer}
                disabled={loadingPrayer}
                className="w-full py-2.5 rounded-xl bg-[#C9A84C] text-[#0F1B3D] font-sans font-semibold text-sm hover:bg-[#F0D27C] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loadingPrayer ? <><Loader2 size={14} className="spinner" /> Generating...</> : "Generate Prayer"}
              </button>

              {aiPrayer && (
                <div className="mt-4 bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-200 leading-relaxed italic">{aiPrayer}</p>
                </div>
              )}
            </div>

            {/* Daily prayers */}
            <div className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-5">
              <h3 className="font-bold text-[#0F1B3D] mb-3">Today&apos;s Prayer Prompts</h3>
              <div className="space-y-3">
                {dailyPrayers.map((p, i) => (
                  <div key={i} className="text-sm text-gray-600 font-sans italic border-l-2 border-[#C9A84C] pl-3 leading-relaxed">{p.slice(0, 90)}...</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Prayer wall */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0F1B3D] text-lg">Community Prayer Wall</h2>
              <span className="text-sm text-gray-400 font-sans">{requests.length} requests</span>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setFilterCat(null)}
                className={`px-3 py-1 rounded-full text-xs font-sans border transition-all ${!filterCat ? "bg-[#0F1B3D] text-[#F0D27C] border-[#0F1B3D]" : "bg-white border-[#F5ECD7] text-gray-500 hover:border-[#C9A84C]"}`}
              >
                All
              </button>
              {CATEGORIES.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat === filterCat ? null : cat)}
                  className={`px-3 py-1 rounded-full text-xs font-sans border transition-all ${filterCat === cat ? "bg-[#C9A84C] text-white border-[#C9A84C]" : "bg-white border-[#F5ECD7] text-gray-500 hover:border-[#C9A84C]"}`}
                >
                  {cat.split(" ").slice(1).join(" ")}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-[#F5ECD7] shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-[#FDF8F0] border border-[#F5ECD7] flex items-center justify-center text-xs font-semibold text-[#0F1B3D]">
                          {req.isAnonymous ? "🙏" : req.name[0]}
                        </div>
                        <span className="font-semibold text-[#0F1B3D] text-sm">{req.name}</span>
                        <span className="text-xs text-gray-400 font-sans">· {req.date}</span>
                      </div>
                      <span className="text-xs bg-[#FDF8F0] border border-[#F5ECD7] rounded-full px-2 py-0.5 text-gray-500 font-sans">{req.category}</span>
                    </div>
                  </div>

                  <p className="text-[#2C1810] text-sm leading-relaxed mb-4">{req.request}</p>

                  <button
                    onClick={() => handlePray(req.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans transition-all ${prayedFor.has(req.id) ? "bg-red-50 border border-red-200 text-red-500" : "bg-[#FDF8F0] border border-[#F5ECD7] text-gray-600 hover:border-[#C9A84C] hover:text-[#8B6914]"}`}
                  >
                    <Heart size={13} className={prayedFor.has(req.id) ? "fill-red-400 text-red-400" : ""} />
                    {prayedFor.has(req.id) ? `Praying (${req.prayed})` : `Pray (${req.prayed})`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
