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
      eyebrow="Skilled provider"
      title={`Welcome back, ${dashboard.user.displayName || "Provider"}`}
      subtitle="Manage your work opportunities, applications, customers and professional profile."
      metrics={[
        { label: "Active applications", value: dashboard.metrics.activeApplications },
        { label: "Accepted applications", value: dashboard.metrics.acceptedApplications },
        { label: "Active engagements", value: dashboard.metrics.activeEngagements },
        { label: "Unread messages", value: dashboard.metrics.unreadMessages, helper: `${dashboard.metrics.completedEngagements} completed engagement${dashboard.metrics.completedEngagements === 1 ? "" : "s"}` },
      ]}
      actions={[
        { label: "Edit profile & account", href: "/account", description: "Manage your professional details, skills, experience, availability and account information." },
        { label: "Find jobs", href: ROUTES.quickJobs, description: "Browse published work opportunities that match your services." },
        { label: "My applications", href: "/applications", description: "Review submitted, shortlisted and accepted applications." },
        { label: "Work engagements", href: "/engagements", description: "Manage confirmed work, quotes, progress and customer communication." },
        { label: "Messages", href: ROUTES.messages, description: "Continue conversations with customers connected through Yartong." },
        { label: "Public profile", href: `/providers/${user.id}`, description: "See how your professional profile appears in the marketplace." },
      ]}
      activityTitle="Recent work activity"
      activities={dashboard.activities}
      emptyActivity="Your applications and work activity will appear here as you use Yartong."
    />
  );
}
