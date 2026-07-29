import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { ROUTES } from "@/lib/constants";
import { getSupplierDashboard } from "@/lib/dashboard";
import { requireUser } from "@/lib/authz";
import { getSupplierInventoryStocks, getSupplierListings } from "@/lib/marketplace/catalog";

export default async function SupplierDashboardPage() {
  const user = await requireUser();
  const [dashboard, listings, stocks] = await Promise.all([
    getSupplierDashboard(user.id),
    getSupplierListings(user.id),
    getSupplierInventoryStocks(user.id),
  ]);
  const profile = dashboard.user.materialSupplierProfile;
  const totalAvailable = stocks.reduce((sum, stock) => sum + stock.available, 0);

  return (
    <RoleDashboard
      eyebrow="Material supplier dashboard"
      title={`Welcome back, ${profile?.businessName || dashboard.user.displayName || "Supplier"}`}
      subtitle={`Manage your supplier profile, product listings and stock${dashboard.user.primaryLocation ? ` around ${dashboard.user.primaryLocation.name}` : ""}. The QA account includes seeded catalog and inventory data for testing.`}
      metrics={[
        { label: "Product listings", value: listings.length },
        { label: "Inventory records", value: stocks.length },
        { label: "Available units", value: totalAvailable },
        { label: "Verification requests", value: dashboard.activeVerificationRequests, helper: dashboard.user.verificationStatus.replaceAll("_", " ").toLowerCase() },
      ]}
      actions={[
        { label: "Edit supplier profile", href: "/account", description: "Edit the seeded supplier's business name, categories, summary and account information." },
        { label: "Products & listings", href: ROUTES.supplierProducts, description: "Inspect seeded products, change listing state and create additional test products." },
        { label: "Inventory", href: ROUTES.supplierInventory, description: "Inspect seeded stock, reconcile quantities and add test inventory locations." },
        { label: "Browse materials", href: ROUTES.materials, description: "See how the seeded supplier products appear in the public materials marketplace." },
        { label: "Verification", href: "/verification", description: "Submit or review identity and business verification requests." },
        { label: "Promote your business", href: ROUTES.advertise, description: "Review the future business visibility and promoted-listing direction." },
      ]}
      activityTitle="Supplier test data"
      activities={[]}
      emptyActivity="Use Products & listings and Inventory to test the seeded supplier catalog, prices and stock controls."
      notice="This preview account uses QA-only seeded data. Product, listing and inventory changes are written to the preview database and can be reset later."
    />
  );
}
