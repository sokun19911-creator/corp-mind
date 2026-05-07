"use client";

import { IdeaRecord } from "@/lib/types";
import { useState } from "react";

interface Props {
  idea: IdeaRecord;
  onGenerateRequirements: (idea: IdeaRecord) => void;
  requirementsLoading: boolean;
}

const VERDICT_STYLE: Record<string, { bg: string; text: string; emoji: string }> = {
  推進: { bg: "bg-green-50", text: "text-green-700", emoji: "✅" },
  条件付き推進: { bg: "bg-blue-50", text: "text-blue-700", emoji: "🔵" },
  保留: { bg: "bg-yellow-50", text: "text-yellow-700", emoji: "⏸️" },
  却下: { bg: "bg-red-50", text: "text-red-700", emoji: "❌" },
};

export default function IdeaDetail({ idea, onGenerateRequirements, requirementsLoading }: Props) {
  const [tab, setTab] = useState<"overview" | "strategy">("overview");
  const vs = VERDICT_STYLE[idea.critic.verdict] ?? { bg: "bg-gray-50", text: "text-gray-700", emoji: "❓" };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="text-xl font-bold text-gray-800">{idea.secretary.title}</h2>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0 ${vs.bg} ${vs.text}`}>
            <span>{vs.emoji}</span>
            <span>{idea.critic.verdict}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{idea.secretary.summary}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {idea.secretary.tags.map((tag) => (
            <span key={tag} className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>📂 {idea.secretary.category}</span>
          <span>⚡ 複雑度: {idea.secretary.complexity}</span>
          <span>🎯 優先度: {idea.secretary.priority}/10</span>
        </div>
      </div>

      {/* Original idea */}
      <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 mb-2">📝 原文</div>
        <p className="text-sm text-gray-700">{idea.raw}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setTab("overview")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            tab === "overview"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "text-gray-500"
          }`}
        >
          分析結果
        </button>
        <button
          onClick={() => setTab("strategy")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            tab === "strategy"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "text-gray-500"
          }`}
        >
          戦略
        </button>
      </div>

      {tab === "overview" && (
        <>
          {/* Critic */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">🔍 批評家の評価</h3>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>実現可能性</span>
                <span className="font-bold text-purple-600">{idea.critic.feasibility}/10</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${idea.critic.feasibility * 10}%`,
                    background: "linear-gradient(90deg, #A855F7, #EC4899)",
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 italic mb-3">&ldquo;{idea.critic.comment}&rdquo;</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-green-600 mb-1">✅ 強み</div>
                {idea.critic.strengths.map((s, i) => (
                  <div key={i} className="text-xs text-gray-600 mb-1">• {s}</div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-red-500 mb-1">⚠️ 弱み</div>
                {idea.critic.weaknesses.map((w, i) => (
                  <div key={i} className="text-xs text-gray-600 mb-1">• {w}</div>
                ))}
              </div>
            </div>
            {idea.critic.risks.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-semibold text-orange-500 mb-1">🚨 リスク</div>
                {idea.critic.risks.map((r, i) => (
                  <div key={i} className="text-xs text-gray-600 mb-1">• {r}</div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {tab === "strategy" && idea.strategist && (
        <div className="space-y-3">
          {[idea.strategist.phase1, idea.strategist.phase2, idea.strategist.phase3].map((phase, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{phase.title}</div>
                  <div className="text-xs text-gray-400">{phase.duration}</div>
                </div>
              </div>
              {phase.actions.map((action, j) => (
                <div key={j} className="text-xs text-gray-600 mb-1 flex items-start gap-2">
                  <span className="text-emerald-400 flex-shrink-0">→</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1">📊 KPI</div>
                <div className="text-sm text-gray-700">{idea.strategist.kpi}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1">💰 予算</div>
                <div className="text-sm text-gray-700">{idea.strategist.budget}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "strategy" && !idea.strategist && (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-400">
          <p className="text-sm">批評家が「却下」と判断したため、戦略は生成されませんでした。</p>
        </div>
      )}

      {/* Requirements button */}
      <button
        onClick={() => onGenerateRequirements(idea)}
        disabled={requirementsLoading}
        className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #3B82F6, #0EA5E9)" }}
      >
        {requirementsLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            要件定義書を生成中...
          </>
        ) : (
          <>📄 要件定義書を生成</>
        )}
      </button>
    </div>
  );
}
