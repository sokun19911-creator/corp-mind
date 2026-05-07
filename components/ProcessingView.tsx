"use client";

interface Step {
  agent: string;
  emoji: string;
  status: "waiting" | "running" | "done";
  color: string;
}

interface Props {
  steps: Step[];
}

export default function ProcessingView({ steps }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6">
      <h2 className="text-xl font-bold text-gray-800 mb-8">AIエージェントが審議中...</h2>
      <div className="w-full max-w-md space-y-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm transition-all duration-500 ${
              step.status === "running" ? "ring-2 ring-purple-300 scale-[1.02]" : ""
            } ${step.status === "waiting" ? "opacity-40" : ""}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${step.color}20` }}
            >
              {step.emoji}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 text-sm">{step.agent}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {step.status === "waiting" && "待機中"}
                {step.status === "running" && (
                  <span className="text-purple-500 animate-pulse">処理中...</span>
                )}
                {step.status === "done" && (
                  <span className="text-green-500">完了</span>
                )}
              </div>
            </div>
            <div className="text-lg">
              {step.status === "done" && "✅"}
              {step.status === "running" && (
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              )}
              {step.status === "waiting" && "⏸️"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
