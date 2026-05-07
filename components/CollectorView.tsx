"use client";

import { useState } from "react";
import { KnowledgeItem } from "@/lib/types";

interface Props {
  items: KnowledgeItem[];
  loading: boolean;
  onCollect: (keyword?: string) => void;
}

export default function CollectorView({ items, loading, onCollect }: Props) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    const kw = keyword.trim();
    onCollect(kw || undefined);
    if (kw) setKeyword("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">🔍 収集家</h2>
        <p className="text-xs text-gray-500">キーワードを入力して最新情報を収集</p>
      </div>

      {/* Search input */}
      <div className="flex gap-2 mb-3 flex-shrink-0">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="調べたいテーマを入力... (例: 生成AI 営業)"
          disabled={loading}
          className="flex-1 rounded-xl border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 flex-shrink-0 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              収集中
            </>
          ) : (
            <>🔍 検索</>
          )}
        </button>
      </div>

      {/* Auto-collect hint */}
      <div className="mb-4 flex-shrink-0">
        <button
          type="button"
          onClick={() => onCollect(undefined)}
          disabled={loading}
          className="text-xs text-amber-600 hover:text-amber-800 disabled:opacity-40 underline underline-offset-2 transition-colors"
        >
          ランダムトピックで自動収集
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 flex-1">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-sm">キーワードを入力して検索するか<br />自動収集ボタンを使ってみましょう</p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-800 text-sm">{item.topic}</h3>
              <span className="text-xs text-gray-400 flex-shrink-0">{item.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
            <div className="space-y-1">
              {item.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-amber-400 flex-shrink-0">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
