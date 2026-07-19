import {
  JobBudgetType,
  JobProviderRole,
  JobStatus,
  JobUrgency,
} from "@prisma/client";

import { PLATFORM, PLATFORM_LIMITS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export type JobIntent = "draft" | "publish";

export type JobInput = {
  title: string;
  description: string;
  category: string;
  skills: string[];
  targetProviderRoles: JobProviderRole[];
  locationId: string;
  budgetType: JobBudgetType;
  budgetMin: number | null;
  budgetMax: number | null;
  currency: string;
  urgency: JobUrgency;
  preferredStartDate: Date | null;
};

export type JobValidationResult =
  | { ok: true; data: JobInput }
  | { ok: false; errors: Record<string, string> };

const providerRoles = new Set<JobProviderRole>(Object.values(JobProviderRole));
const urgencies = new Set<JobUrgency>(Object.values(JobUrgency));
const budgetTypes = new Set<JobBudgetType>(Object.values(JobBudgetType));

export const allowedTransitions: Record<JobStatus, JobStatus[]> = {
  [JobStatus.DRAFT]: [JobStatus.PUBLISHED, JobStatus.CANCELLED],
  [JobStatus.PUBLISHED]: [JobStatus.CLOSED, JobStatus.CANCELLED],
  [JobStatus.CLOSED]: [],
  [JobStatus.CANCELLED]: [],
};

function first(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function paise(value: string): number | null {
  if (!value) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return Number.NaN;
  return Math.round(Number(value) * 100);
}

export function paiseToRupees(value?: number | null) {
  return value == null ? "" : (value / 100).toFixed(2);
}

export function formatMoney(
  value?: number | null,
  currency = PLATFORM.defaultCurrency,
) {
  return value == null
    ? ""
    : new Intl.NumberFormat(PLATFORM.defaultLocale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value / 100);
}

export function formatBudget(
  type: JobBudgetType,
  min?: number | null,
  max?: number | null,
  currency = PLATFORM.defaultCurrency,
) {
  if (type === JobBudgetType.NEGOTIABLE) return "Negotiable";
  if (type === JobBudgetType.FIXED) return formatMoney(min, currency);
  return `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
}

export async function validateJobForm(
  form: FormData,
): Promise<JobValidationResult> {
  const errors: Record<string, string> = {};
  const title = first(form, "title");
  const description = first(form, "description");
  const category = first(form, "category");
  const skills = first(form, "skills")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 20);
  const targetProviderRoles = form
    .getAll("targetProviderRoles")
    .map(String)
    .filter((role): role is JobProviderRole =>
      providerRoles.has(role as JobProviderRole),
    );
  const locationId = first(form, "locationId");
  const budgetType = first(form, "budgetType") as JobBudgetType;
  const budgetMin = paise(first(form, "budgetMin"));
  const budgetMax = paise(first(form, "budgetMax"));
  const urgency = first(form, "urgency") as JobUrgency;
  const preferred = first(form, "preferredStartDate");
  const preferredStartDate = preferred
    ? new Date(`${preferred}T00:00:00.000Z`)
    : null;

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > PLATFORM_LIMITS.maximumJobTitleLength) {
    errors.title = "Title is too long.";
  }

  if (!description) {
    errors.description = "Description is required.";
  } else if (
    description.length > PLATFORM_LIMITS.maximumJobDescriptionLength
  ) {
    errors.description = "Description is too long.";
  }

  if (!category) errors.category = "Category is required.";
  if (!skills.length) errors.skills = "Add at least one skill.";
  if (!targetProviderRoles.length) {
    errors.targetProviderRoles = "Choose at least one worker target.";
  }

  const location = locationId
    ? await prisma.location.findFirst({
        where: { id: locationId, isActive: true },
        select: { id: true },
      })
    : null;
  if (!location) errors.locationId = "Choose an active location.";

  if (!budgetTypes.has(budgetType)) {
    errors.budgetType = "Choose a valid budget type.";
  }
  if (!urgencies.has(urgency)) {
    errors.urgency = "Choose a valid urgency.";
  }
  if (
    preferred &&
    preferredStartDate !== null &&
    Number.isNaN(preferredStartDate.getTime())
  ) {
    errors.preferredStartDate = "Choose a valid preferred start date.";
  }

  if (
    budgetMin !== null &&
    (!Number.isInteger(budgetMin) || budgetMin <= 0)
  ) {
    errors.budgetMin = "Enter a positive amount.";
  }
  if (
    budgetMax !== null &&
    (!Number.isInteger(budgetMax) || budgetMax <= 0)
  ) {
    errors.budgetMax = "Enter a positive amount.";
  }

  if (budgetType === JobBudgetType.FIXED) {
    if (!budgetMin || budgetMin <= 0) {
      errors.budgetMin = "Fixed budget is required.";
    }
  }

  if (budgetType === JobBudgetType.RANGE) {
    if (!budgetMin || budgetMin <= 0) {
      errors.budgetMin = "Minimum budget is required.";
    }
    if (!budgetMax || budgetMax <= 0) {
      errors.budgetMax = "Maximum budget is required.";
    }
    if (budgetMin && budgetMax && budgetMax < budgetMin) {
      errors.budgetMax = "Maximum must be at least the minimum.";
    }
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      title,
      description,
      category,
      skills,
      targetProviderRoles,
      locationId,
      budgetType,
      budgetMin: budgetType === JobBudgetType.NEGOTIABLE ? null : budgetMin,
      budgetMax: budgetType === JobBudgetType.RANGE ? budgetMax : null,
      currency: PLATFORM.defaultCurrency,
      urgency,
      preferredStartDate,
    },
  };
}

export function canTransition(from: JobStatus, to: JobStatus) {
  return allowedTransitions[from].includes(to);
}
