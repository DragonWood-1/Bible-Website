"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, Heart, Flower2, Music, RefreshCw, Bookmark } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  data?: {
    verse?: { text: string; reference: string };
    affirmation?: string;
    prayer?: string;
    encouragement?: string;
  };
}

const QUICK_PROMPTS = [
  "I feel overwhelmed and stressed",
  "I am struggling with anxiety",
  "I feel hopeless and discouraged",
  "I need strength to keep going",
  "I am going through grief and loss",
  "I feel lonely and forgotten",
  "I am scared about my future",
  "I need peace in my marriage",
];

export default function EncouragementPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("savedEncouragement");
    if (saved) setSavedItems(JSON.parse(saved));
  }, []);

  async function handleSend(text?: string) {
    const userText = text ?? input.trim();
    if (!userText || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const response = await fetch("/api/encouragement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.encouragement, data }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm here with you. Remember: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' (Psalm 34:18) You are not alone.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSave(text: string) {
    setSavedItems(prev => {
      const updated = prev.includes(text) ? prev.filter(s => s !== text) : [...prev, text];
      localStorage.setItem("savedEncouragement", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="hero-bg py-10 sm:py-14 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-3">
            <Heart size={24} className="text-[#F0D27C]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">AI Christian Encouragement</h1>
          <p className="text-gray-300 font-sans leading-relaxed text-sm sm:text-base">
            Share what you&apos;re feeling and receive personalized Bible verses, affirmations, and prayer — rooted in God&apos;s Word.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Quick prompts */}
        {messages.length === 0 && (
          <div className="mb-8">
            <p className="text-center text-sm text-gray-500 font-sans mb-4">Not sure how to start? Try one of these:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-2 rounded-full bg-white border border-[#F5ECD7] text-sm text-[#0F1B3D] font-sans hover:border-[#C9A84C] hover:bg-[#FDF8F0] transition-all shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="space-y-6 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <div className="chat-user px-4 py-3 max-w-[85%] sm:max-w-sm text-sm font-sans">{msg.content}</div>
              ) : (
                <div className="w-full">
                  {msg.data ? (
                    <div className="space-y-4">
                      {/* Encouragement */}
                      <div className="bg-white rounded-2xl border border-[#F5ECD7] p-5 shadow-sm">
                        <p className="text-[#2C1810] leading-relaxed">{msg.content || msg.data.encouragement}</p>
                      </div>

                      {/* Verse */}
                      {msg.data.verse && (
                        <div className="bg-gradient-to-r from-[#0F1B3D] to-[#1E3A6E] rounded-2xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={14} className="text-[#F0D27C]" />
                            <span className="text-[#F0D27C] text-xs font-sans uppercase tracking-wide">Scripture for You</span>
                          </div>
                          <blockquote className="text-white italic leading-relaxed mb-2">&ldquo;{msg.data.verse.text}&rdquo;</blockquote>
                          <p className="text-[#F0D27C] text-sm font-sans font-semibold">{msg.data.verse.reference}</p>
                          <button
                            onClick={() => handleSave(msg.data!.verse!.text)}
                            className="mt-3 flex items-center gap-1 text-xs text-gray-300 hover:text-[#F0D27C] transition-colors font-sans"
                          >
                            <Bookmark size={12} className={savedItems.includes(msg.data.verse.text) ? "fill-[#F0D27C] text-[#F0D27C]" : ""} />
                            {savedItems.includes(msg.data.verse.text) ? "Saved" : "Save verse"}
                          </button>
                        </div>
                      )}

                      {/* Affirmation */}
                      {msg.data.affirmation && (
                        <div className="bg-[#FDF8F0] rounded-2xl border border-[#F5ECD7] p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart size={14} className="text-[#C9A84C]" />
                            <span className="text-[#8B6914] text-xs font-sans uppercase tracking-wide">Affirmation</span>
                          </div>
                          <p className="text-[#2C1810] italic">{msg.data.affirmation}</p>
                        </div>
                      )}

                      {/* Prayer */}
                      {msg.data.prayer && (
                        <div className="bg-purple-50 rounded-2xl border border-purple-100 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Flower2 size={14} className="text-purple-600" />
                            <span className="text-purple-700 text-xs font-sans uppercase tracking-wide">Prayer for You</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm">{msg.data.prayer}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="chat-ai px-5 py-4 max-w-lg">
                      <p className="text-[#2C1810] text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="chat-ai px-5 py-4 flex items-center gap-3">
                <Loader2 size={16} className="spinner text-[#C9A84C]" />
                <span className="text-gray-500 text-sm font-sans">Seeking God&apos;s Word for you...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-[#FDF8F0] pb-safe pt-2">
          <div className="bg-white rounded-2xl border-2 border-[#F5ECD7] focus-within:border-[#C9A84C] transition-colors shadow-sm">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Share how you're feeling..."
              className="w-full px-4 pt-3 pb-2 bg-transparent resize-none text-[#2C1810] font-sans text-sm focus:outline-none"
              rows={2}
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="hidden sm:flex gap-2 text-xs text-gray-400 font-sans items-center">
                <Music size={13} />
                <span>Meditation for calming music</span>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1B3D] text-[#F0D27C] text-sm font-sans hover:bg-[#1E3A6E] transition-colors disabled:opacity-40 ml-auto"
              >
                {loading ? <Loader2 size={14} className="spinner" /> : <Send size={14} />}
                Send
              </button>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="mt-3 flex items-center gap-1 mx-auto text-xs text-gray-400 hover:text-gray-600 font-sans transition-colors"
            >
              <RefreshCw size={12} />
              Start new conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
