"use client";

import { Level } from "@/lib/types";

interface Props {
  level: Level;
  onChange: (l: Level) => void;
}

const LEVELS: { value: Level; label: string; desc: string }[] = [
  { value: "beginner", label: "初心者", desc: "わかりやすく" },
  { value: "intermediate", label: "中級者", desc: "ビジネス向け" },
  { value: "expert", label: "上級者", desc: "技術的詳細" },
];

export default function LevelPicker({ level, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-purple-100">
      {LEVELS.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          className={`flex-1 rounded-lg py-1.5 px-2 text-xs font-semibold transition-all ${
            level === l.value
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
              : "text-gray-500 hover:text-purple-600"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
