import { UserRole } from "@prisma/client";

import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { ROUTES } from "@/lib/constants";
import { getProviderDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";

export default async function ContractorDashboardPage() {
  const user = await requireUser();
  const dashboard = await getProviderDashboard(user.id, UserRole.CONTRACTOR);

  return (
    <RoleDashboard
      eyebrow="Contractor dashboard"
      title={`Welcome back, ${dashboard.user.displayName || "Contractor"}`}
      subtitle={`Track bids, hired projects and customer communication${dashboard.user.primaryLocation ? ` around ${dashboard.user.primaryLocation.name}` : ""}.`}
      metrics={[
        { label: "Active applications", value: dashboard.metrics.activeApplications },
        { label: "Accepted applications", value: dashboard.metrics.acceptedApplications },
        { label: "Active engagements", value: dashboard.metrics.activeEngagements },
        { label: "Unread messages", value: dashboard.metrics.unreadMessages, helper: `${dashboard.metrics.completedEngagements} completed engagement${dashboard.metrics.completedEngagements === 1 ? "" : "s"}` },
      ]}
      actions={[
        { label: "Edit contractor profile", href: "/account", description: "Edit seeded business details, team size, project types, experience and availability." },
        { label: "Find projects", href: ROUTES.quickJobs, description: "Browse published jobs seeking contractors and qualified providers." },
        { label: "My applications", href: "/applications", description: "Track project applications from submission through hiring." },
        { label: "Project engagements", href: "/engagements", description: "Manage agreed scope, quotes, project progress, messages and payments." },
        { label: "Messages", href: ROUTES.messages, description: "Continue private conversations with customers after a marketplace hire." },
        { label: "Public profile", href: `/providers/${user.id}`, description: "Open this seeded contractor's public marketplace profile." },
      ]}
      activityTitle="Recent project activity"
      activities={dashboard.activities}
      emptyActivity="Applications and project engagements will appear here as your contractor activity grows."
    />
  );
}
