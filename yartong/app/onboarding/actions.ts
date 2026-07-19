"use server";

import { redirect } from "next/navigation";

import { requireOnboardingUser } from "@/lib/authz";
import { getDashboardForRole, isPublicOnboardingRole, type PublicOnboardingRole } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

export type OnboardingState = { error?: string; fieldErrors?: Record<string, string> };

const phonePattern = /^[+()\-\s0-9]{7,24}$/;
const splitList = (value: FormDataEntryValue | null) => String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean).slice(0, 12);
const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim();
const intOrNull = (value: FormDataEntryValue | null) => {
  const text = clean(value);
  if (!text) return null;
  const parsed = Number.parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

export async function completeOnboarding(_prev: OnboardingState | undefined, formData: FormData): Promise<OnboardingState> {
  const user = await requireOnboardingUser();
  if (user.primaryRole !== "ONBOARDING_PENDING" && user.primaryRole !== "CUSTOMER" && user.primaryRole !== "SKILLED_PROVIDER" && user.primaryRole !== "LABOURER" && user.primaryRole !== "CONTRACTOR" && user.primaryRole !== "MATERIAL_SUPPLIER") {
    return { error: "This account cannot use public onboarding." };
  }

  const role = clean(formData.get("role"));
  const displayName = clean(formData.get("displayName"));
  const phoneNumber = clean(formData.get("phoneNumber"));
  const locationId = clean(formData.get("locationId"));
  const headline = clean(formData.get("headline"));
  const businessName = clean(formData.get("businessName"));
  const skills = splitList(formData.get("skills"));
  const materialCategories = splitList(formData.get("materialCategories"));
  const experienceYears = intOrNull(formData.get("experienceYears"));
  const teamSize = intOrNull(formData.get("teamSize"));
  const deliveryAvailable = formData.get("deliveryAvailable") === "on";
  const availableForWork = formData.get("availableForWork") !== "off";
  const fieldErrors: Record<string, string> = {};

  if (!isPublicOnboardingRole(role)) fieldErrors.role = "Choose one public Yartong role.";
  if (user.primaryRole !== "ONBOARDING_PENDING" && role !== user.primaryRole) fieldErrors.role = "Your existing account role cannot be changed through onboarding.";
  if (displayName.length < 2 || displayName.length > 80) fieldErrors.displayName = "Display name must be 2–80 characters.";
  if (phoneNumber && !phonePattern.test(phoneNumber)) fieldErrors.phoneNumber = "Enter a valid phone number or leave it blank.";
  if (!locationId) fieldErrors.locationId = "Choose your primary Yartong location.";
  if (["SKILLED_PROVIDER", "LABOURER"].includes(role) && skills.length === 0) fieldErrors.skills = "Add at least one skill.";
  if (role === "MATERIAL_SUPPLIER" && materialCategories.length === 0) fieldErrors.materialCategories = "Add at least one material category.";
  if (["SKILLED_PROVIDER", "LABOURER", "CONTRACTOR"].includes(role) && (experienceYears === null || Number.isNaN(experienceYears) || experienceYears < 0 || experienceYears > 60)) fieldErrors.experienceYears = "Enter experience between 0 and 60 years.";
  if (["SKILLED_PROVIDER", "CONTRACTOR"].includes(role) && (headline.length < 8 || headline.length > 140)) fieldErrors.headline = "Add an 8–140 character service summary.";
  if (role === "LABOURER" && headline && headline.length > 140) fieldErrors.headline = "Keep the availability summary under 140 characters.";
  if (["CONTRACTOR", "MATERIAL_SUPPLIER"].includes(role) && (businessName.length < 2 || businessName.length > 100)) fieldErrors.businessName = "Business name must be 2–100 characters.";
  if (role === "CONTRACTOR" && (teamSize === null || Number.isNaN(teamSize) || teamSize < 1 || teamSize > 500)) fieldErrors.teamSize = "Enter a team size between 1 and 500.";

  const location = locationId ? await prisma.location.findFirst({ where: { id: locationId, isActive: true }, select: { id: true } }) : null;
  if (locationId && !location) fieldErrors.locationId = "Choose an active Yartong location.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: "Please fix the highlighted fields." };

  const selectedRole = role as PublicOnboardingRole;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { displayName, name: displayName, phoneNumber: phoneNumber || null, primaryLocationId: locationId, primaryRole: selectedRole } });
    if (role === "CUSTOMER") await tx.customerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true }, create: { userId: user.id, onboardingComplete: true } });
    if (role === "SKILLED_PROVIDER") await tx.skilledProviderProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, headline, experienceYears: experienceYears as number, skills, availableForWork }, create: { userId: user.id, onboardingComplete: true, headline, experienceYears: experienceYears as number, skills, availableForWork } });
    if (role === "LABOURER") await tx.labourerProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, headline: headline || null, experienceYears: experienceYears as number, skills, availableForWork }, create: { userId: user.id, onboardingComplete: true, headline: headline || null, experienceYears: experienceYears as number, skills, availableForWork } });
    if (role === "CONTRACTOR") await tx.contractorProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName, headline, experienceYears: experienceYears as number, teamSize: teamSize as number, projectTypes: skills, availableForWork }, create: { userId: user.id, onboardingComplete: true, businessName, headline, experienceYears: experienceYears as number, teamSize: teamSize as number, projectTypes: skills, availableForWork } });
    if (role === "MATERIAL_SUPPLIER") await tx.materialSupplierProfile.upsert({ where: { userId: user.id }, update: { onboardingComplete: true, businessName, headline: clean(formData.get("supplierSummary")) || null, materialCategories, deliveryAvailable }, create: { userId: user.id, onboardingComplete: true, businessName, headline: clean(formData.get("supplierSummary")) || null, materialCategories, deliveryAvailable } });
  });

  redirect(getDashboardForRole(selectedRole));
}
