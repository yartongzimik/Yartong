"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const clean = (value: FormDataEntryValue | null) => String(value ?? "").trim();
const splitList = (value: FormDataEntryValue | null) =>
  clean(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);

const optionalInt = (value: FormDataEntryValue | null) => {
  const text = clean(value);
  if (!text) return null;
  const parsed = Number.parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function updateAccountProfileAction(formData: FormData) {
  const user = await requireUser();
  const displayName = clean(formData.get("displayName"));
  const image = clean(formData.get("image"));
  const headline = clean(formData.get("headline"));
  const bio = clean(formData.get("bio"));
  const businessName = clean(formData.get("businessName"));
  const skills = splitList(formData.get("skills"));
  const experienceYears = optionalInt(formData.get("experienceYears"));
  const teamSize = optionalInt(formData.get("teamSize"));
  const serviceRadiusKm = optionalInt(formData.get("serviceRadiusKm"));
  const availableForWork = formData.get("availableForWork") === "on";

  if (displayName.length < 2 || displayName.length > 80) {
    redirect("/account?error=invalid-name");
  }
  if (image && !/^https:\/\//i.test(image)) {
    redirect("/account?error=invalid-image");
  }
  if (headline.length > 140 || bio.length > 800) {
    redirect("/account?error=invalid-profile");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        displayName,
        name: displayName,
        image: image || null,
      },
    });

    if (user.primaryRole === "CUSTOMER") {
      await tx.customerProfile.update({
        where: { userId: user.id },
        data: { bio: bio || null },
      });
    }

    if (user.primaryRole === "SKILLED_PROVIDER") {
      await tx.skilledProviderProfile.update({
        where: { userId: user.id },
        data: {
          businessName: businessName || null,
          headline: headline || null,
          bio: bio || null,
          experienceYears,
          skills,
          serviceRadiusKm,
          availableForWork,
        },
      });
    }

    if (user.primaryRole === "LABOURER") {
      await tx.labourerProfile.update({
        where: { userId: user.id },
        data: {
          headline: headline || null,
          bio: bio || null,
          experienceYears,
          skills,
          availableForWork,
        },
      });
    }

    if (user.primaryRole === "CONTRACTOR") {
      await tx.contractorProfile.update({
        where: { userId: user.id },
        data: {
          businessName: businessName || null,
          headline: headline || null,
          bio: bio || null,
          experienceYears,
          teamSize,
          projectTypes: skills,
          serviceRadiusKm,
          availableForWork,
        },
      });
    }

    if (user.primaryRole === "MATERIAL_SUPPLIER") {
      await tx.materialSupplierProfile.update({
        where: { userId: user.id },
        data: {
          businessName: businessName || null,
          headline: headline || null,
          bio: bio || null,
          materialCategories: skills,
        },
      });
    }
  });

  revalidatePath("/account");
  revalidatePath(`/providers/${user.id}`);
  redirect("/account?saved=1");
}
