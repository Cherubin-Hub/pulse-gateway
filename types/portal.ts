export interface ApplicationItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: "Activity" | "Flame" | "BookOpen" | "ShieldCheck";
  url: string;
  isActive: boolean;
  isComingSoon: boolean;
  category: "Trading" | "Risk" | "Analytics";
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: "trader" | "admin";
}
