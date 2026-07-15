import type { SkillLevel } from "./types";

export interface SkillLevelDefinition {
  id: SkillLevel;

  name: string;

  shortName: string;

  description: string;

  recommendedExperience: string;

  recommendedProjects: string;

  customerType: string;

  badgeColor: string;

  searchPriority: number;
}

export const SKILL_LEVELS: SkillLevelDefinition[] = [
  {
    id: "LEVEL_1_ASSISTANT",

    name: "Foundation",

    shortName: "F1",

    description:
      "Suitable for basic repairs, helper work and straightforward jobs under normal supervision.",

    recommendedExperience: "0-2 Years",

    recommendedProjects: "0-50",

    customerType:
      "Budget-conscious customers and simple household work.",

    badgeColor: "#6B7280",

    searchPriority: 1,
  },

  {
    id: "LEVEL_2_SKILLED",

    name: "Professional",

    shortName: "P2",

    description:
      "Experienced tradesperson capable of completing most residential and commercial work independently.",

    recommendedExperience: "2-5 Years",

    recommendedProjects: "50-250",

    customerType:
      "Most homeowners and businesses.",

    badgeColor: "#2563EB",

    searchPriority: 2,
  },

  {
    id: "LEVEL_3_PROFESSIONAL",

    name: "Specialist",

    shortName: "S3",

    description:
      "Highly skilled professional with consistent performance, strong customer ratings and specialized expertise.",

    recommendedExperience: "5-10 Years",

    recommendedProjects: "250-1000",

    customerType:
      "Customers seeking high-quality workmanship.",

    badgeColor: "#9333EA",

    searchPriority: 3,
  },

  {
    id: "LEVEL_4_SPECIALIST",

    name: "Master",

    shortName: "M4",

    description:
      "Industry-leading professional with an outstanding portfolio, excellent customer satisfaction and proven leadership.",

    recommendedExperience: "10+ Years",

    recommendedProjects: "1000+",

    customerType:
      "Premium residential, commercial and complex projects.",

    badgeColor: "#F59E0B",

    searchPriority: 4,
  },
];

export function getSkillLevel(
  id: SkillLevel,
): SkillLevelDefinition | undefined {
  return SKILL_LEVELS.find((level) => level.id === id);
}

export function getSkillLevelName(id: SkillLevel): string {
  return getSkillLevel(id)?.name ?? id;
}

export function getSkillLevelBadge(id: SkillLevel): string {
  return getSkillLevel(id)?.shortName ?? "";
}

export function getSkillLevelColor(id: SkillLevel): string {
  return getSkillLevel(id)?.badgeColor ?? "#6B7280";
}

export function getSkillLevelPriority(id: SkillLevel): number {
  return getSkillLevel(id)?.searchPriority ?? 0;
}