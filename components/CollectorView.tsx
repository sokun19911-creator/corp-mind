"use client";

import { KnowledgeItem } from "@/lib/types";

interface Props {
  items: KnowledgeItem[];
  loading: boolean;
  onCollect: () => void;
}

export default function CollectorView({ items, loading, onCollect }: Props) {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">🔍 収集家</h2>
          <p className="text-xs text-gray-500">最新ビジネス情報を収集</p>
        </div>
        <button
          onClick={onCollect}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              収集中
            </>
          ) : (
            <>🔍 収集する</>
          )}
        </button>
      </div>

      {items.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-sm">「収集する」ボタンで最新情報を取得します</p>
        </div>
      )}

      <div className="space-y-3">
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
