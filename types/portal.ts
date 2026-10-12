export interface ApplicationItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: "Activity" | "Flame" | "BookOpen" | "ShieldCheck" | "TrendingUp" | "BarChart3" | "Cpu" | "Zap";
  url: string;
  isActive: boolean;
  isComingSoon: boolean;
  category: "Trading" | "Risk" | "Analytics" | "Quant";
  latencyMs?: number;
  version?: string;
}

export interface TraderProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  createdAt?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: "trader" | "admin";
}
