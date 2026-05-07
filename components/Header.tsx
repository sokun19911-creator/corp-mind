"use client";

interface Props {
  onIdeate: () => void;
  ideating: boolean;
}

export default function Header({ onIdeate, ideating }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)" }}
        >
          🧠
        </div>
        <span className="font-black text-gray-800 text-lg tracking-tight">Corp Mind AI</span>
      </div>
      <button
        onClick={onIdeate}
        disabled={ideating}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)" }}
      >
        {ideating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            発想中
          </>
        ) : (
          <>💡 発想家</>
        )}
      </button>
    </header>
  );
}
