import { ApplicationStatus, EngagementStatus, JobStatus, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const ACTIVE_ENGAGEMENT_STATUSES = [
  EngagementStatus.PENDING,
  EngagementStatus.CONFIRMED,
  EngagementStatus.IN_PROGRESS,
  EngagementStatus.DISPUTED,
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(value);
}

async function unreadMessageCount(userId: string) {
  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: userId },
      conversation: {
        OR: [{ customerId: userId }, { providerId: userId }],
      },
    },
  });
}

export async function getCustomerDashboard(userId: string) {
  const [
    user,
    publishedJobs,
    draftJobs,
    activeEngagements,
    completedEngagements,
    unreadMessages,
    recentJobs,
    recentEngagements,
  ] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        displayName: true,
        verificationStatus: true,
        primaryLocation: { select: { name: true } },
      },
    }),
    prisma.job.count({ where: { customerId: userId, status: JobStatus.PUBLISHED } }),
    prisma.job.count({ where: { customerId: userId, status: JobStatus.DRAFT } }),
    prisma.engagement.count({
      where: { customerId: userId, status: { in: ACTIVE_ENGAGEMENT_STATUSES } },
    }),
    prisma.engagement.count({
      where: { customerId: userId, status: EngagementStatus.COMPLETED },
    }),
    unreadMessageCount(userId),
    prisma.job.findMany({
      where: { customerId: userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
    prisma.engagement.findMany({
      where: { customerId: userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        job: { select: { title: true } },
      },
    }),
  ]);

  const activities = [
    ...recentEngagements.map((item) => ({
      title: item.job.title,
      href: `/engagements/${item.id}`,
      meta: `${item.status.replaceAll("_", " ")} · ${formatDate(item.updatedAt)}`,
      sortAt: item.updatedAt,
    })),
    ...recentJobs.map((item) => ({
      title: item.title,
      href: `/customer/jobs/${item.id}`,
      meta: `${item.status.replaceAll("_", " ")} · ${formatDate(item.updatedAt)}`,
      sortAt: item.updatedAt,
    })),
  ]
    .sort((a, b) => b.sortAt.getTime() - a.sortAt.getTime())
    .slice(0, 6)
    .map(({ sortAt: _sortAt, ...item }) => item);

  return {
    user,
    metrics: {
      publishedJobs,
      draftJobs,
      activeEngagements,
      completedEngagements,
      unreadMessages,
    },
    activities,
  };
}

const PROVIDER_ROLES = [
  UserRole.SKILLED_PROVIDER,
  UserRole.LABOURER,
  UserRole.CONTRACTOR,
] as const;

type ProviderRole = (typeof PROVIDER_ROLES)[number];

export async function getProviderDashboard(userId: string, role: ProviderRole) {
  const [
    user,
    activeApplications,
    acceptedApplications,
    activeEngagements,
    completedEngagements,
    unreadMessages,
    recentApplications,
    recentEngagements,
  ] = await Promise.all([
    prisma.user.findFirstOrThrow({
      where: { id: userId, primaryRole: role },
      select: {
        displayName: true,
        verificationStatus: true,
        primaryLocation: { select: { name: true } },
      },
    }),
    prisma.jobApplication.count({
      where: {
        providerId: userId,
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.SHORTLISTED] },
      },
    }),
    prisma.jobApplication.count({
      where: { providerId: userId, status: ApplicationStatus.ACCEPTED },
    }),
    prisma.engagement.count({
      where: { providerId: userId, status: { in: ACTIVE_ENGAGEMENT_STATUSES } },
    }),
    prisma.engagement.count({
      where: { providerId: userId, status: EngagementStatus.COMPLETED },
    }),
    unreadMessageCount(userId),
    prisma.jobApplication.findMany({
      where: { providerId: userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        job: { select: { id: true, title: true } },
      },
    }),
    prisma.engagement.findMany({
      where: { providerId: userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        job: { select: { title: true } },
      },
    }),
  ]);

  const activities = [
    ...recentEngagements.map((item) => ({
      title: item.job.title,
      href: `/engagements/${item.id}`,
      meta: `${item.status.replaceAll("_", " ")} · ${formatDate(item.updatedAt)}`,
      sortAt: item.updatedAt,
    })),
    ...recentApplications.map((item) => ({
      title: item.job.title,
      href: `/jobs/${item.job.id}`,
      meta: `${item.status.replaceAll("_", " ")} · ${formatDate(item.updatedAt)}`,
      sortAt: item.updatedAt,
    })),
  ]
    .sort((a, b) => b.sortAt.getTime() - a.sortAt.getTime())
    .slice(0, 6)
    .map(({ sortAt: _sortAt, ...item }) => item);

  return {
    user,
    metrics: {
      activeApplications,
      acceptedApplications,
      activeEngagements,
      completedEngagements,
      unreadMessages,
    },
    activities,
  };
}

export async function getSupplierDashboard(userId: string) {
  const [user, activeVerificationRequests] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        displayName: true,
        verificationStatus: true,
        primaryLocation: { select: { name: true } },
        materialSupplierProfile: {
          select: {
            businessName: true,
            materialCategories: true,
            deliveryAvailable: true,
            wholesaleAvailable: true,
          },
        },
      },
    }),
    prisma.verificationRequest.count({
      where: {
        userId,
        status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
      },
    }),
  ]);

  return { user, activeVerificationRequests };
}
