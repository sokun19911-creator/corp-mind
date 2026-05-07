"use client";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
        style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)" }}
      >
        🧠
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Corp Mind AI へようこそ</h2>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        5人のAIエージェントがあなたのビジネスアイデアを審議・計画・アーカイブします。
        下のフォームにアイデアを入力するか、発想家ボタンでAIにアイデアを生成させましょう。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
        {[
          { emoji: "🔍", name: "収集家", desc: "最新市場情報をウェブから収集", color: "#F59E0B" },
          { emoji: "💡", name: "発想家", desc: "ユニークなビジネスアイデアを生成", color: "#A855F7" },
          { emoji: "📝", name: "書記", desc: "アイデアを整理・分類・記録", color: "#3B82F6" },
          { emoji: "🔍", name: "批評家", desc: "強み・弱み・リスクを分析", color: "#EF4444" },
          { emoji: "🗺️", name: "戦略家", desc: "3フェーズの行動計画を策定", color: "#10B981" },
        ].map((a) => (
          <div
            key={a.name}
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${a.color}20` }}
            >
              {a.emoji}
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">{a.name}</div>
              <div className="text-xs text-gray-500">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
