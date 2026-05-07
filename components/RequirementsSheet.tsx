"use client";

import { Requirements } from "@/lib/types";
import { useState } from "react";

interface Props {
  requirements: Requirements;
  onClose: () => void;
}

export default function RequirementsSheet({ requirements, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(requirements.claudeCodePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PRIORITY_COLOR: Record<string, string> = {
    高: "bg-red-100 text-red-700",
    中: "bg-yellow-100 text-yellow-700",
    低: "bg-green-100 text-green-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white rounded-t-3xl p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">📄 要件定義書</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Project name & overview */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{requirements.projectName}</h3>
            <p className="text-sm text-gray-600">{requirements.overview}</p>
          </div>

          {/* Tech stack */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h4 className="font-bold text-gray-700 text-sm mb-3">🛠️ 技術スタック</h4>
            <div className="flex flex-wrap gap-2">
              {requirements.techStack.map((tech) => (
                <span key={tech} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* MVP Features */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h4 className="font-bold text-gray-700 text-sm mb-3">⭐ MVP機能</h4>
            <div className="space-y-2">
              {requirements.mvpFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 mt-0.5 ${PRIORITY_COLOR[f.priority]}`}>
                    {f.priority}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{f.name}</div>
                    <div className="text-xs text-gray-500">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Models */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h4 className="font-bold text-gray-700 text-sm mb-3">🗄️ データモデル</h4>
            <div className="space-y-3">
              {requirements.dataModels.map((m, i) => (
                <div key={i}>
                  <div className="font-semibold text-gray-700 text-sm mb-1">{m.name}</div>
                  <div className="bg-gray-50 rounded-xl p-2 font-mono text-xs text-gray-600 space-y-0.5">
                    {m.fields.map((f, j) => (
                      <div key={j}>{f}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation steps */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h4 className="font-bold text-gray-700 text-sm mb-3">🚀 実装ステップ</h4>
            <div className="space-y-2">
              {requirements.implementationSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-700 mt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Claude Code Prompt */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white text-sm">💬 Claude Codeプロンプト</h4>
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all font-medium"
              >
                {copied ? "✅ コピー済み" : "📋 コピー"}
              </button>
            </div>
            <pre className="text-green-400 text-xs whitespace-pre-wrap font-mono leading-relaxed">
              {requirements.claudeCodePrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
