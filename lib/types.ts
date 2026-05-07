export type Level = "beginner" | "intermediate" | "expert";

export interface KnowledgeItem {
  id: number;
  topic: string;
  summary: string;
  keyPoints: string[];
  timestamp: string;
}

export interface IdeaRecord {
  id: number;
  raw: string;
  level: Level;
  timestamp: string;
  secretary: {
    title: string;
    summary: string;
    category: string;
    tags: string[];
    priority: number;
    complexity: string;
  };
  critic: {
    feasibility: number;
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    verdict: "推進" | "条件付き推進" | "保留" | "却下";
    comment: string;
  };
  strategist: {
    phase1: { title: string; duration: string; actions: string[] };
    phase2: { title: string; duration: string; actions: string[] };
    phase3: { title: string; duration: string; actions: string[] };
    kpi: string;
    budget: string;
  } | null;
}

export interface Requirements {
  projectName: string;
  overview: string;
  techStack: string[];
  mvpFeatures: { name: string; description: string; priority: "高" | "中" | "低" }[];
  dataModels: { name: string; fields: string[] }[];
  implementationSteps: string[];
  claudeCodePrompt: string;
}
