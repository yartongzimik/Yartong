import { UserRole } from "@prisma/client";

import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { ROUTES } from "@/lib/constants";
import { getProviderDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";

export default async function LabourerDashboardPage() {
  const user = await requireUser();
  const dashboard = await getProviderDashboard(user.id, UserRole.LABOURER);

  return (
    <RoleDashboard
      eyebrow="Labourer dashboard"
      title={`Welcome back, ${dashboard.user.displayName || "Labourer"}`}
      subtitle={`Keep track of job applications, hired work and customer messages${dashboard.user.primaryLocation ? ` around ${dashboard.user.primaryLocation.name}` : ""}.`}
      metrics={[
        { label: "Active applications", value: dashboard.metrics.activeApplications },
        { label: "Accepted applications", value: dashboard.metrics.acceptedApplications },
        { label: "Active engagements", value: dashboard.metrics.activeEngagements },
        {
          label: "Unread messages",
          value: dashboard.metrics.unreadMessages,
          helper: `${dashboard.metrics.completedEngagements} completed engagement${dashboard.metrics.completedEngagements === 1 ? "" : "s"}`,
        },
      ]}
      actions={[
        {
          label: "Find quick work",
          href: ROUTES.quickJobs,
          description: "Browse available job listings and apply where your role is eligible.",
        },
        {
          label: "My applications",
          href: "/applications",
          description: "Track submitted, shortlisted and accepted job applications.",
        },
        {
          label: "Work engagements",
          href: "/engagements",
          description: "See hired work, progress status, messages and agreed terms.",
        },
        {
          label: "Messages",
          href: ROUTES.messages,
          description: "Continue private conversations with customers who have hired you.",
        },
        {
          label: "Marketplace profile",
          href: ROUTES.workers,
          description: "Review the public worker marketplace where active profiles are discovered.",
        },
        {
          label: "Verification",
          href: "/verification",
          description: `Current trust status: ${dashboard.user.verificationStatus.replaceAll("_", " ").toLowerCase()}.`,
        },
      ]}
      activityTitle="Recent work activity"
      activities={dashboard.activities}
      emptyActivity="Applications and engagements will appear here as you begin taking work through Yartong."
    />
  );
}
