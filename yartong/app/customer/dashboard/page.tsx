import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { ROUTES } from "@/lib/constants";
import { getCustomerDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";

export default async function CustomerDashboardPage() {
  const user = await requireUser();
  const dashboard = await getCustomerDashboard(user.id);

  return (
    <RoleDashboard
      eyebrow="Customer dashboard"
      title={`Welcome back, ${dashboard.user.displayName || "Customer"}`}
      subtitle={`Manage jobs, hired providers, messages and payments from one place${dashboard.user.primaryLocation ? ` in ${dashboard.user.primaryLocation.name}` : ""}.`}
      metrics={[
        { label: "Published jobs", value: dashboard.metrics.publishedJobs },
        { label: "Draft jobs", value: dashboard.metrics.draftJobs },
        { label: "Active engagements", value: dashboard.metrics.activeEngagements },
        {
          label: "Unread messages",
          value: dashboard.metrics.unreadMessages,
          helper: `${dashboard.metrics.completedEngagements} completed engagement${dashboard.metrics.completedEngagements === 1 ? "" : "s"}`,
        },
      ]}
      actions={[
        {
          label: "Post a job",
          href: ROUTES.postJob,
          description: "Create a new construction or service job and publish it when ready.",
        },
        {
          label: "Manage my jobs",
          href: ROUTES.customerJobs,
          description: "Review drafts, published listings and applicants for your jobs.",
        },
        {
          label: "Work engagements",
          href: "/engagements",
          description: "Track hired providers, agreed work, quotes, progress and payment status.",
        },
        {
          label: "Messages",
          href: ROUTES.messages,
          description: "Continue private conversations with providers you have hired.",
        },
        {
          label: "Find providers",
          href: ROUTES.workers,
          description: "Discover active skilled providers and labourers in the marketplace.",
        },
        {
          label: "Verification",
          href: "/verification",
          description: `Current trust status: ${dashboard.user.verificationStatus.replaceAll("_", " ").toLowerCase()}.`,
        },
      ]}
      activityTitle="Recent marketplace activity"
      activities={dashboard.activities}
      emptyActivity="Your recent jobs and engagements will appear here once you start using the marketplace."
    />
  );
}
