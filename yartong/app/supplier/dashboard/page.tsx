import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { ROUTES } from "@/lib/constants";
import { getSupplierDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";

export default async function SupplierDashboardPage() {
  const user = await requireUser();
  const dashboard = await getSupplierDashboard(user.id);
  const profile = dashboard.user.materialSupplierProfile;
  const categories = profile?.materialCategories.length ?? 0;

  return (
    <RoleDashboard
      eyebrow="Material supplier dashboard"
      title={`Welcome back, ${profile?.businessName || dashboard.user.displayName || "Supplier"}`}
      subtitle={`Manage your supplier presence and trust status${dashboard.user.primaryLocation ? ` around ${dashboard.user.primaryLocation.name}` : ""}. Product catalog and inventory workflows remain the next supplier-facing build area.`}
      metrics={[
        { label: "Material categories", value: categories },
        {
          label: "Delivery",
          value: profile?.deliveryAvailable ? "Enabled" : "Not set",
        },
        {
          label: "Wholesale",
          value: profile?.wholesaleAvailable ? "Enabled" : "Not set",
        },
        {
          label: "Verification requests",
          value: dashboard.activeVerificationRequests,
          helper: dashboard.user.verificationStatus.replaceAll("_", " ").toLowerCase(),
        },
      ]}
      actions={[
        {
          label: "Supplier profile",
          href: ROUTES.supplierProfile,
          description: "Review the business information associated with your supplier account.",
        },
        {
          label: "Verification",
          href: "/verification",
          description: "Submit or review identity and business verification requests.",
        },
        {
          label: "Browse materials",
          href: ROUTES.materials,
          description: "Review the public materials marketplace experience and category structure.",
        },
        {
          label: "Products",
          href: ROUTES.supplierProducts,
          description: "Open the reserved supplier product area as catalog workflows are built out.",
        },
        {
          label: "Inventory",
          href: ROUTES.supplierInventory,
          description: "Open the reserved inventory area for the upcoming supplier operations milestone.",
        },
        {
          label: "Promote your business",
          href: ROUTES.advertise,
          description: "Review the future business visibility and promoted-listing direction.",
        },
      ]}
      activityTitle="Supplier readiness"
      activities={[]}
      emptyActivity="Your supplier catalog, inventory updates and material enquiries will appear here once those marketplace workflows are implemented."
      notice="Yartong does not yet expose live supplier product or inventory persistence. This dashboard intentionally shows only real account/profile state and links to the next supplier workflows rather than fabricating stock or sales data."
    />
  );
}
