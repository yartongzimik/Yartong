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
      subtitle={`Manage your supplier profile, product listings and stock${dashboard.user.primaryLocation ? ` around ${dashboard.user.primaryLocation.name}` : ""}.`}
      metrics={[
        { label: "Product listings", value: listings.length },
        { label: "Inventory records", value: stocks.length },
        { label: "Available units", value: totalAvailable },
        { label: "Verification requests", value: dashboard.activeVerificationRequests, helper: dashboard.user.verificationStatus.replaceAll("_", " ").toLowerCase() },
      ]}
      actions={[
        { label: "Edit supplier profile", href: "/account", description: "Edit business name, material categories, delivery options and account information." },
        { label: "Products & listings", href: ROUTES.supplierProducts, description: "Manage products, prices, listing status and customer-facing catalogue information." },
        { label: "Inventory", href: ROUTES.supplierInventory, description: "Review available stock, reconcile quantities and manage inventory locations." },
        { label: "Browse materials", href: ROUTES.materials, description: "See how your products appear to customers in the public materials marketplace." },
        { label: "Verification", href: "/verification", description: "Manage identity and business verification requests." },
        { label: "Promote your business", href: ROUTES.advertise, description: "Review advertising and promoted-listing options for your business." },
      ]}
      activityTitle="Supplier activity"
      activities={[]}
      emptyActivity="Product, inventory and order activity will appear here as your business uses Yartong."
    />
  );
}
