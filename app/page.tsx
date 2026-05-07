"use client";

import { useState } from "react";
import Header from "@/components/Header";
import LevelPicker from "@/components/LevelPicker";
import Welcome from "@/components/Welcome";
import ProcessingView from "@/components/ProcessingView";
import CollectorView from "@/components/CollectorView";
import ArchiveList from "@/components/ArchiveList";
import IdeaDetail from "@/components/IdeaDetail";
import RequirementsSheet from "@/components/RequirementsSheet";
import { IdeaRecord, KnowledgeItem, Level, Requirements } from "@/lib/types";
import {
  getSecretaryPrompt,
  getCriticPrompt,
  getStrategistPrompt,
  getIdeatorPrompt,
  COLLECTOR_PROMPT,
  REQUIREMENTS_PROMPT,
} from "@/lib/prompts";

type View = "home" | "collector" | "archive";

type ProcessStep = {
  agent: string;
  emoji: string;
  status: "waiting" | "running" | "done";
  color: string;
};

const INITIAL_STEPS: ProcessStep[] = [
  { agent: "書記", emoji: "📝", status: "waiting", color: "#3B82F6" },
  { agent: "批評家", emoji: "🔍", status: "waiting", color: "#EF4444" },
  { agent: "戦略家", emoji: "🗺", status: "waiting", color: "#10B981" },
];

const TABS: { id: View; emoji: string; label: string }[] = [
  { id: "home", emoji: "🏠", label: "ホーム" },
  { id: "collector", emoji: "🔍", label: "収集家" },
  { id: "archive", emoji: "📦", label: "アーカイブ" },
];

async function callClaude(system: string, content: string, maxTokens = 2048) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, content, maxTokens }),
  });
  if (!res.ok) throw new Error("Claude API error");
  return res.json();
}

async function callClaudeSearch(system: string, userMessage: string) {
  const res = await fetch("/api/claude-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, userMessage }),
  });
  if (!res.ok) throw new Error("Claude Search API error");
  return res.json();
}

export default function Home() {
  const [level, setLevel] = useState<Level>("intermediate");
  const [input, setInput] = useState("");
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [view, setView] = useState<View>("home");
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessStep[]>(INITIAL_STEPS);
  const [ideating, setIdeating] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [requirements, setRequirements] = useState<Requirements | null>(null);
  const [reqLoading, setReqLoading] = useState(false);

  const selectedIdea = ideas.find((i) => i.id === selectedId) ?? null;

  const updateStep = (index: number, status: "waiting" | "running" | "done") => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status } : s)));
  };

  const switchView = (v: View) => {
    setView(v);
  };

  const processIdea = async (raw: string) => {
    if (!raw.trim() || processing) return;
    setProcessing(true);
    switchView("home");
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "waiting" as const })));

    try {
      updateStep(0, "running");
      const secretary = await callClaude(getSecretaryPrompt(level), raw);
      updateStep(0, "done");

      updateStep(1, "running");
      const critic = await callClaude(getCriticPrompt(level), raw);
      updateStep(1, "done");

      let strategist = null;
      if (critic.verdict !== "却下") {
        updateStep(2, "running");
        strategist = await callClaude(
          getStrategistPrompt(level),
          `アイデア: ${raw}\n書記メモ: ${secretary.summary}\n批評家評価: ${critic.comment}`
        );
        updateStep(2, "done");
      } else {
        updateStep(2, "done");
      }

      const newIdea: IdeaRecord = {
        id: Date.now(),
        raw,
        level,
        timestamp: new Date().toLocaleString("ja-JP"),
        secretary,
        critic,
        strategist,
      };
      setIdeas((prev) => [...prev, newIdea]);
      setSelectedId(newIdea.id);
      setInput("");
    } catch (e) {
      console.error(e);
      alert("処理中にエラーが発生しました。");
    } finally {
      setProcessing(false);
      setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "waiting" })));
    }
  };

  const handleIdeate = async () => {
    if (ideating || processing) return;
    setIdeating(true);
    try {
      const result = await callClaude(
        getIdeatorPrompt(knowledge),
        "ビジネスアイデアを1つ生成してください。"
      );
      setInput(result.idea ?? "");
    } catch (e) {
      console.error(e);
      alert("アイデア生成に失敗しました。");
    } finally {
      setIdeating(false);
    }
  };

  const handleCollect = async () => {
    if (collecting) return;
    setCollecting(true);
    try {
      const topics = [
        "最新のSaaS市場トレンド",
        "AI活用ビジネスの成功事例",
        "スタートアップの資金調達動向",
      ];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const result = await callClaudeSearch(
        COLLECTOR_PROMPT,
        `${topic}について最新情報を収集してください。`
      );
      const newItem: KnowledgeItem = {
        id: Date.now(),
        topic: result.topic ?? topic,
        summary: result.summary ?? "",
        keyPoints: result.keyPoints ?? [],
        timestamp: new Date().toLocaleTimeString("ja-JP"),
      };
      setKnowledge((prev) => [newItem, ...prev].slice(0, 10));
    } catch (e) {
      console.error(e);
      alert("情報収集に失敗しました。");
    } finally {
      setCollecting(false);
    }
  };

  const handleGenerateRequirements = async (idea: IdeaRecord) => {
    if (reqLoading) return;
    setReqLoading(true);
    try {
      const content = `
アイデア: ${idea.raw}
タイトル: ${idea.secretary.title}
要約: ${idea.secretary.summary}
カテゴリ: ${idea.secretary.category}
タグ: ${idea.secretary.tags.join(", ")}
実現可能性: ${idea.critic.feasibility}/10
判定: ${idea.critic.verdict}
批評: ${idea.critic.comment}
${idea.strategist ? `KPI: ${idea.strategist.kpi}\n予算: ${idea.strategist.budget}` : ""}
      `.trim();
      const result = await callClaude(REQUIREMENTS_PROMPT, content, 4096);
      setRequirements(result);
    } catch (e) {
      console.error(e);
      alert("要件定義書の生成に失敗しました。");
    } finally {
      setReqLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processIdea(input);
  };

  const mainContent = () => {
    if (processing) return <ProcessingView steps={steps} />;
    if (view === "collector") {
      return (
        <CollectorView items={knowledge} loading={collecting} onCollect={handleCollect} />
      );
    }
    if (view === "archive") {
      return (
        <div className="p-4 overflow-y-auto h-full">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📦 アーカイブ</h2>
          <ArchiveList
            ideas={ideas}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              switchView("home");
            }}
          />
        </div>
      );
    }
    if (selectedIdea) {
      return (
        <IdeaDetail
          idea={selectedIdea}
          onGenerateRequirements={handleGenerateRequirements}
          requirementsLoading={reqLoading}
        />
      );
    }
    return <Welcome />;
  };

  const bgStyle = {
    background: "linear-gradient(160deg, #F3EEFF, #FFF0F8, #EEF6FF, #EDFFF6)",
  };

  return (
    <div style={{ ...bgStyle, height: "100dvh", overflow: "hidden" }}>

      {/* ── Desktop (md+) ─────────────────────────────────────── */}
      <div className="hidden md:flex h-full overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col bg-white/60 backdrop-blur-sm border-r border-purple-100 overflow-hidden">
          {/* Logo + level */}
          <div className="p-4 border-b border-purple-100 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)" }}
              >
                🧠
              </div>
              <span className="font-black text-gray-800 text-lg">Corp Mind AI</span>
            </div>
            <LevelPicker level={level} onChange={setLevel} />
          </div>

          {/* Sidebar nav tabs */}
          <div className="flex border-b border-purple-100 flex-shrink-0">
            {[
              { id: "collector" as View, label: "収集家", emoji: "🔍" },
              { id: "archive" as View, label: "アーカイブ", emoji: "📦" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchView(view === t.id ? "home" : t.id)}
                className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors border-b-2 ${
                  view === t.id
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-transparent text-gray-500 hover:text-purple-500"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            {view === "collector" ? (
              <CollectorView items={knowledge} loading={collecting} onCollect={handleCollect} />
            ) : (
              <div className="p-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  アーカイブ ({ideas.length})
                </div>
                <ArchiveList
                  ideas={ideas}
                  selectedId={selectedId}
                  onSelect={(id) => {
                    setSelectedId(id);
                    switchView("home");
                  }}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0">{mainContent()}</div>

          {/* Input bar */}
          <div className="border-t border-purple-100 bg-white/80 backdrop-blur-sm p-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ビジネスアイデアを入力... または💡ボタンでAI生成"
                className="flex-1 rounded-2xl border border-purple-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                disabled={processing}
              />
              <button
                type="button"
                onClick={handleIdeate}
                disabled={ideating || processing}
                className="px-4 py-2 rounded-2xl text-white text-sm font-bold disabled:opacity-50 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)" }}
              >
                {ideating ? "..." : "💡"}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || processing}
                className="px-5 py-2 rounded-2xl text-white text-sm font-bold disabled:opacity-50 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #3B82F6, #0EA5E9)" }}
              >
                審議
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Mobile (< md) ─────────────────────────────────────── */}
      <div className="flex md:hidden flex-col h-full overflow-hidden">

        {/* Header */}
        <Header onIdeate={handleIdeate} ideating={ideating} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {mainContent()}
        </div>

        {/* Bottom nav — part of the flex column, never fixed */}
        <nav
          className="flex-shrink-0 bg-white/95 border-t border-purple-100"
          style={{ boxShadow: "0 -2px 12px rgba(100,80,180,0.08)" }}
        >
          {/* Level picker row */}
          <div className="px-3 pt-2 pb-1">
            <LevelPicker level={level} onChange={setLevel} />
          </div>

          {/* Input row */}
          <form onSubmit={handleSubmit} className="flex gap-2 px-3 pb-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="アイデアを入力..."
              className="flex-1 rounded-xl border border-purple-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              disabled={processing}
            />
            <button
              type="submit"
              disabled={!input.trim() || processing}
              className="px-4 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-50 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3B82F6, #0EA5E9)" }}
            >
              審議
            </button>
          </form>

          {/* Tab bar */}
          <div className="flex border-t border-purple-50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchView(tab.id)}
                className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors ${
                  view === tab.id ? "text-purple-600" : "text-gray-400"
                }`}
              >
                <span className="text-xl leading-none">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {requirements && (
        <RequirementsSheet requirements={requirements} onClose={() => setRequirements(null)} />
      )}
    </div>
  );
}
