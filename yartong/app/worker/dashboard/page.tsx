import { UserRole } from "@prisma/client";

import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { ROUTES } from "@/lib/constants";
import { getProviderDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";

export default async function SkilledProviderDashboardPage() {
  const user = await requireUser();
  const dashboard = await getProviderDashboard(user.id, UserRole.SKILLED_PROVIDER);

  return (
    <RoleDashboard
      eyebrow="Skilled provider dashboard"
      title={`Welcome back, ${dashboard.user.displayName || "Provider"}`}
      subtitle={`Track applications, hired work and customer conversations${dashboard.user.primaryLocation ? ` around ${dashboard.user.primaryLocation.name}` : ""}.`}
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
          label: "Find jobs",
          href: ROUTES.quickJobs,
          description: "Browse published work opportunities that match marketplace provider roles.",
        },
        {
          label: "My applications",
          href: "/applications",
          description: "Review submitted, shortlisted and accepted applications.",
        },
        {
          label: "Work engagements",
          href: "/engagements",
          description: "Manage confirmed work, quotes, progress, messaging and payment status.",
        },
        {
          label: "Messages",
          href: ROUTES.messages,
          description: "Message customers privately after a legitimate marketplace hire.",
        },
        {
          label: "Public profile",
          href: ROUTES.workers,
          description: "Check how active provider profiles appear in public marketplace discovery.",
        },
        {
          label: "Verification",
          href: "/verification",
          description: `Current trust status: ${dashboard.user.verificationStatus.replaceAll("_", " ").toLowerCase()}.`,
        },
      ]}
      activityTitle="Recent work activity"
      activities={dashboard.activities}
      emptyActivity="Applications and engagements will appear here as you participate in the marketplace."
    />
  );
}
