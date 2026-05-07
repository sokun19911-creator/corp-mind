"use client";

import { IdeaRecord } from "@/lib/types";

interface Props {
  ideas: IdeaRecord[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const VERDICT_COLOR: Record<string, string> = {
  推進: "bg-green-100 text-green-700",
  条件付き推進: "bg-blue-100 text-blue-700",
  保留: "bg-yellow-100 text-yellow-700",
  却下: "bg-red-100 text-red-700",
};

export default function ArchiveList({ ideas, selectedId, onSelect }: Props) {
  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-400">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-sm">審議済みのアイデアがここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {[...ideas].reverse().map((idea) => (
        <button
          key={idea.id}
          type="button"
          onClick={() => onSelect(idea.id)}
          className={`w-full text-left rounded-xl p-3 transition-all cursor-pointer ${
            selectedId === idea.id
              ? "bg-purple-50 ring-2 ring-purple-300"
              : "bg-white hover:bg-purple-50 active:bg-purple-100"
          } shadow-sm`}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-semibold text-gray-800 text-sm truncate">
              {idea.secretary.title}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                VERDICT_COLOR[idea.critic.verdict] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {idea.critic.verdict}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{idea.secretary.summary}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {idea.secretary.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-right mt-1">
            <span className="text-xs text-gray-300">詳細を見る →</span>
          </div>
        </button>
      ))}
    </div>
  );
}
