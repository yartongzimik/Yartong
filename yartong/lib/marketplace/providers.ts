import { Prisma, UserRole, VerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const PUBLIC_PROVIDER_ROLES = [
  "SKILLED_PROVIDER",
  "LABOURER",
  "CONTRACTOR",
] as const;

export type PublicProviderRole = (typeof PUBLIC_PROVIDER_ROLES)[number];
export type WorkerRoleFilter = "all" | "skilled" | "labourer";

const PAGE_SIZE = 12;

const ROLE_LABELS: Record<PublicProviderRole, string> = {
  SKILLED_PROVIDER: "Skilled Provider",
  LABOURER: "Labourer",
  CONTRACTOR: "Contractor",
};

const publicLocationSelect = {
  id: true,
  slug: true,
  name: true,
  district: true,
  state: true,
  country: true,
} satisfies Prisma.LocationSelect;

const publicProviderSelect = {
  id: true,
  displayName: true,
  primaryRole: true,
  verificationStatus: true,
  isDemo: true,
  primaryLocation: { select: publicLocationSelect },
  skilledProviderProfile: {
    select: {
      onboardingComplete: true,
      businessName: true,
      headline: true,
      bio: true,
      experienceYears: true,
      skills: true,
      serviceRadiusKm: true,
      availableForWork: true,
    },
  },
  labourerProfile: {
    select: {
      onboardingComplete: true,
      headline: true,
      bio: true,
      experienceYears: true,
      skills: true,
      availableForWork: true,
    },
  },
  contractorProfile: {
    select: {
      onboardingComplete: true,
      businessName: true,
      headline: true,
      bio: true,
      experienceYears: true,
      teamSize: true,
      projectTypes: true,
      serviceRadiusKm: true,
      availableForWork: true,
    },
  },
} satisfies Prisma.UserSelect;

type PublicProviderRecord = Prisma.UserGetPayload<{
  select: typeof publicProviderSelect;
}>;

export type PublicLocation = NonNullable<
  PublicProviderRecord["primaryLocation"]
>;

export type PublicProviderCard = {
  id: string;
  displayName: string;
  role: PublicProviderRole;
  roleLabel: string;
  businessName?: string;
  headline?: string;
  bio?: string;
  experienceYears?: number;
  teamSize?: number;
  serviceRadiusKm?: number;
  skills: string[];
  availabilityLabel: string;
  availableForWork: boolean;
  verificationStatus: VerificationStatus;
  verificationLabel: string;
  isVerified: boolean;
  isDemo: boolean;
  location: PublicLocation | null;
};

export type ProviderSearchParams = {
  q?: string;
  location?: string;
  role?: WorkerRoleFilter;
  skill?: string;
  projectType?: string;
  page?: string | number;
};

export function isPublicProviderRole(
  role: UserRole,
): role is PublicProviderRole {
  return PUBLIC_PROVIDER_ROLES.includes(role as PublicProviderRole);
}

export function isPubliclyListableProvider(
  user: Pick<
    PublicProviderRecord,
    | "primaryRole"
    | "primaryLocation"
    | "skilledProviderProfile"
    | "labourerProfile"
    | "contractorProfile"
  > & {
    accountStatus?: string;
  },
) {
  if (!isPublicProviderRole(user.primaryRole)) return false;
  if ("accountStatus" in user && user.accountStatus !== "ACTIVE") return false;
  if (!user.primaryLocation) return false;

  if (user.primaryRole === "SKILLED_PROVIDER") {
    return Boolean(user.skilledProviderProfile?.onboardingComplete);
  }
  if (user.primaryRole === "LABOURER") {
    return Boolean(user.labourerProfile?.onboardingComplete);
  }
  return Boolean(user.contractorProfile?.onboardingComplete);
}

function verificationLabel(status: VerificationStatus) {
  return status === "UNVERIFIED"
    ? "Not verified yet"
    : status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase());
}

function basePublicProvider(
  user: PublicProviderRecord,
  role: PublicProviderRole,
) {
  return {
    id: user.id,
    role,
    roleLabel: ROLE_LABELS[role],
    verificationStatus: user.verificationStatus,
    verificationLabel: verificationLabel(user.verificationStatus),
    isVerified:
      user.verificationStatus !== "UNVERIFIED" &&
      user.verificationStatus !== "PHONE_VERIFIED",
    isDemo: user.isDemo,
    location: user.primaryLocation,
  };
}

function toPublicProvider(
  user: PublicProviderRecord,
): PublicProviderCard | null {
  if (!isPublicProviderRole(user.primaryRole)) return null;
  if (!user.primaryLocation) return null;

  if (user.primaryRole === "SKILLED_PROVIDER") {
    const profile = user.skilledProviderProfile;
    if (!profile?.onboardingComplete) return null;

    return {
      ...basePublicProvider(user, "SKILLED_PROVIDER"),
      displayName: user.displayName || profile.businessName || "Yartong provider",
      businessName: profile.businessName ?? undefined,
      headline: profile.headline ?? undefined,
      bio: profile.bio ?? undefined,
      experienceYears: profile.experienceYears ?? undefined,
      teamSize: undefined,
      serviceRadiusKm: profile.serviceRadiusKm ?? undefined,
      skills: profile.skills,
      availableForWork: profile.availableForWork,
      availabilityLabel: profile.availableForWork
        ? "Available for enquiries"
        : "Availability limited",
    };
  }

  if (user.primaryRole === "LABOURER") {
    const profile = user.labourerProfile;
    if (!profile?.onboardingComplete) return null;

    return {
      ...basePublicProvider(user, "LABOURER"),
      displayName: user.displayName || "Yartong provider",
      businessName: undefined,
      headline: profile.headline ?? undefined,
      bio: profile.bio ?? undefined,
      experienceYears: profile.experienceYears ?? undefined,
      teamSize: undefined,
      serviceRadiusKm: undefined,
      skills: profile.skills,
      availableForWork: profile.availableForWork,
      availabilityLabel: profile.availableForWork
        ? "Available for enquiries"
        : "Availability limited",
    };
  }

  const profile = user.contractorProfile;
  if (!profile?.onboardingComplete) return null;

  return {
    ...basePublicProvider(user, "CONTRACTOR"),
    displayName: user.displayName || profile.businessName || "Yartong provider",
    businessName: profile.businessName ?? undefined,
    headline: profile.headline ?? undefined,
    bio: profile.bio ?? undefined,
    experienceYears: profile.experienceYears ?? undefined,
    teamSize: profile.teamSize ?? undefined,
    serviceRadiusKm: profile.serviceRadiusKm ?? undefined,
    skills: profile.projectTypes,
    availableForWork: profile.availableForWork,
    availabilityLabel: profile.availableForWork
      ? "Available for enquiries"
      : "Availability limited",
  };
}

function clean(value?: string) {
  return value?.trim() || undefined;
}

function pageNumber(page?: string | number) {
  const n = Number(page ?? 1);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function roleEligibilityWhere(
  roles: PublicProviderRole[],
): Prisma.UserWhereInput[] {
  return roles.map((role) => {
    if (role === "SKILLED_PROVIDER") {
      return {
        primaryRole: role,
        skilledProviderProfile: { is: { onboardingComplete: true } },
      };
    }

    if (role === "LABOURER") {
      return {
        primaryRole: role,
        labourerProfile: { is: { onboardingComplete: true } },
      };
    }

    return {
      primaryRole: role,
      contractorProfile: { is: { onboardingComplete: true } },
    };
  });
}

function roleWhere(
  roles: PublicProviderRole[],
  params: ProviderSearchParams,
): Prisma.UserWhereInput {
  const q = clean(params.q);
  const skill = clean(params.skill);
  const projectType = clean(params.projectType);
  const location = clean(params.location);

  const and: Prisma.UserWhereInput[] = [
    { accountStatus: "ACTIVE" },
    { OR: roleEligibilityWhere(roles) },
    { primaryLocation: { is: { isActive: true } } },
  ];

  if (location) {
    and.push({ primaryLocation: { is: { slug: location, isActive: true } } });
  }

  if (q) {
    and.push({
      OR: [
        { displayName: { contains: q, mode: "insensitive" } },
        {
          skilledProviderProfile: {
            is: {
              OR: [
                { businessName: { contains: q, mode: "insensitive" } },
                { headline: { contains: q, mode: "insensitive" } },
                { skills: { has: q } },
              ],
            },
          },
        },
        {
          labourerProfile: {
            is: {
              OR: [
                { headline: { contains: q, mode: "insensitive" } },
                { skills: { has: q } },
              ],
            },
          },
        },
        {
          contractorProfile: {
            is: {
              OR: [
                { businessName: { contains: q, mode: "insensitive" } },
                { headline: { contains: q, mode: "insensitive" } },
                { projectTypes: { has: q } },
              ],
            },
          },
        },
      ],
    });
  }

  if (skill) {
    and.push({
      OR: [
        { skilledProviderProfile: { is: { skills: { has: skill } } } },
        { labourerProfile: { is: { skills: { has: skill } } } },
      ],
    });
  }

  if (projectType) {
    and.push({
      contractorProfile: { is: { projectTypes: { has: projectType } } },
    });
  }

  return { AND: and };
}

export async function getActiveMarketplaceLocations() {
  return prisma.location.findMany({
    where: { isActive: true },
    select: publicLocationSelect,
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
  });
}

export async function getProviderDiscovery(
  roles: PublicProviderRole[],
  params: ProviderSearchParams,
) {
  const page = pageNumber(params.page);
  const where = roleWhere(roles, params);

  const [total, rows, locations] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: publicProviderSelect,
      orderBy: [{ isDemo: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.location.findMany({
      where: { isActive: true },
      select: publicLocationSelect,
      orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
    }),
  ]);

  const providers = rows
    .map(toPublicProvider)
    .filter((provider): provider is PublicProviderCard => Boolean(provider));

  return {
    providers,
    locations,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getPublicProviderById(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id,
      AND: [
        { accountStatus: "ACTIVE" },
        { OR: roleEligibilityWhere([...PUBLIC_PROVIDER_ROLES]) },
        { primaryLocation: { is: { isActive: true } } },
      ],
    },
    select: publicProviderSelect,
  });

  return user ? toPublicProvider(user) : null;
}
