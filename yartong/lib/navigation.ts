import type { Permission, UserRole } from "./types";
import { ROUTES } from "./constants";
import { canAccess } from "./permissions";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;

  description?: string;
  icon?: string;

  permission?: Permission;

  visibleToPublic?: boolean;
  visibleToRoles?: UserRole[];

  badge?: string;
  isExternal?: boolean;
  isDisabled?: boolean;

  children?: NavigationItem[];
}

/**
 * Main public navigation displayed across the Yartong marketplace.
 */
export const PUBLIC_NAVIGATION: NavigationItem[] = [
  {
    id: "find-workers",
    label: "Find Workers",
    href: ROUTES.workers,
    description:
      "Browse skilled providers, labourers and contractors.",
    visibleToPublic: true,
  },

  {
    id: "quick-jobs",
    label: "Quick Jobs",
    href: ROUTES.quickJobs,
    description:
      "Find or post urgent, short-duration work.",
    visibleToPublic: true,
  },

  {
    id: "materials",
    label: "Find Materials",
    href: ROUTES.materials,
    description:
      "Browse construction materials and request quotations.",
    visibleToPublic: true,
  },

  {
    id: "post-job",
    label: "Post a Job",
    href: ROUTES.postJob,
    description:
      "Create a work request for local providers.",
    permission: "POST_JOB",
    visibleToPublic: false,
    visibleToRoles: [
      "CUSTOMER",
      "CONTRACTOR",
      "ADMIN",
    ],
  },

  {
    id: "advertise",
    label: "Advertise",
    href: ROUTES.advertise,
    description:
      "Promote a service, business or material listing.",
    visibleToPublic: true,
  },
];

/**
 * Registration menu displayed under “Join Yartong”.
 */
export const JOIN_NAVIGATION: NavigationItem[] = [
  {
    id: "join-customer",
    label: "Register as Customer",
    href: `${ROUTES.register}?role=CUSTOMER`,
    description:
      "Post jobs, request quotations and save providers.",
    visibleToPublic: true,
  },

  {
    id: "join-skilled-provider",
    label: "Register as Skilled Provider",
    href: `${ROUTES.register}?role=SKILLED_PROVIDER`,
    description:
      "Build a professional trade profile and receive job requests.",
    visibleToPublic: true,
  },

  {
    id: "join-labourer",
    label: "Register as Labourer",
    href: `${ROUTES.register}?role=LABOURER`,
    description:
      "Find daily, temporary, part-time and contract work.",
    visibleToPublic: true,
  },

  {
    id: "join-contractor",
    label: "Register as Contractor",
    href: `${ROUTES.register}?role=CONTRACTOR`,
    description:
      "Manage projects, teams, quotations and enquiries.",
    visibleToPublic: true,
  },

  {
    id: "join-material-supplier",
    label: "Register as Material Supplier",
    href: `${ROUTES.register}?role=MATERIAL_SUPPLIER`,
    description:
      "List materials, manage inventory and receive quotation requests.",
    visibleToPublic: true,
  },
];

/**
 * Navigation shared by authenticated users.
 */
export const ACCOUNT_NAVIGATION: NavigationItem[] = [
  {
    id: "messages",
    label: "Messages",
    href: ROUTES.messages,
    permission: "SEND_MESSAGES",
  },

  {
    id: "account-profile",
    label: "Profile",
    href: "/account/profile",
    permission: "MANAGE_PROFILE",
  },

  {
    id: "account-settings",
    label: "Settings",
    href: "/account/settings",
  },
];

/**
 * Customer dashboard navigation.
 */
export const CUSTOMER_NAVIGATION: NavigationItem[] = [
  {
    id: "customer-dashboard",
    label: "Overview",
    href: ROUTES.customerDashboard,
  },

  {
    id: "customer-post-job",
    label: "Post a Job",
    href: ROUTES.postJob,
    permission: "POST_JOB",
  },

  {
    id: "customer-jobs",
    label: "My Jobs",
    href: ROUTES.customerJobs,
    permission: "MANAGE_OWN_JOBS",
  },

  {
    id: "customer-messages",
    label: "Messages",
    href: ROUTES.customerMessages,
    permission: "SEND_MESSAGES",
  },

  {
    id: "customer-saved-providers",
    label: "Saved Providers",
    href: "/customer/saved-providers",
    permission: "SAVE_PROVIDERS",
  },

  {
    id: "customer-saved-materials",
    label: "Saved Materials",
    href: "/customer/saved-materials",
    permission: "SAVE_PRODUCTS",
  },

  {
    id: "customer-membership",
    label: "Membership",
    href: ROUTES.customerMembership,
  },

  {
    id: "customer-reviews",
    label: "My Reviews",
    href: "/customer/reviews",
  },
];

/**
 * Skilled provider dashboard navigation.
 */
export const SKILLED_PROVIDER_NAVIGATION: NavigationItem[] = [
  {
    id: "provider-dashboard",
    label: "Dashboard",
    href: ROUTES.skilledProviderDashboard,
  },

  {
    id: "provider-profile",
    label: "Business Profile",
    href: ROUTES.skilledProviderProfile,
    permission: "MANAGE_PROFILE",
  },

  {
    id: "provider-services",
    label: "Trades & Services",
    href: "/worker/services",
    permission: "MANAGE_PROFILE",
  },

  {
    id: "provider-portfolio",
    label: "Portfolio",
    href: "/worker/portfolio",
    permission: "MANAGE_PORTFOLIO",
  },

  {
    id: "provider-job-requests",
    label: "Job Requests",
    href: "/worker/job-requests",
    permission: "RECEIVE_JOB_REQUESTS",
  },

  {
    id: "provider-active-jobs",
    label: "Active Jobs",
    href: "/worker/jobs",
    permission: "ACCEPT_JOBS",
  },

  {
    id: "provider-quotations",
    label: "Quotations",
    href: "/worker/quotations",
    permission: "CREATE_QUOTATIONS",
  },

  {
    id: "provider-messages",
    label: "Messages",
    href: ROUTES.messages,
    permission: "SEND_MESSAGES",
  },

  {
    id: "provider-analytics",
    label: "Business Analytics",
    href: "/worker/analytics",
    permission: "VIEW_ADVANCED_ANALYTICS",
  },

  {
    id: "provider-availability",
    label: "Availability",
    href: "/worker/availability",
    permission: "MANAGE_AVAILABILITY",
  },

  {
    id: "provider-advertising",
    label: "Advertising",
    href: ROUTES.advertise,
    permission: "ADVERTISE",
  },
];

/**
 * Labourer dashboard navigation.
 */
export const LABOURER_NAVIGATION: NavigationItem[] = [
  {
    id: "labourer-dashboard",
    label: "Dashboard",
    href: ROUTES.labourerDashboard,
  },

  {
    id: "labourer-profile",
    label: "Work Profile",
    href: ROUTES.labourerProfile,
    permission: "MANAGE_PROFILE",
  },

  {
    id: "labourer-opportunities",
    label: "Work Opportunities",
    href: "/labourer/opportunities",
    permission: "RECEIVE_JOB_REQUESTS",
  },

  {
    id: "labourer-active-work",
    label: "Active Work",
    href: "/labourer/jobs",
    permission: "ACCEPT_JOBS",
  },

  {
    id: "labourer-availability",
    label: "Availability",
    href: "/labourer/availability",
    permission: "MANAGE_AVAILABILITY",
  },

  {
    id: "labourer-performance",
    label: "Performance",
    href: "/labourer/performance",
    permission: "VIEW_BASIC_ANALYTICS",
  },

  {
    id: "labourer-messages",
    label: "Messages",
    href: ROUTES.messages,
    permission: "SEND_MESSAGES",
  },

  {
    id: "labourer-work-history",
    label: "Work History",
    href: "/labourer/history",
  },
];

/**
 * Contractor dashboard navigation.
 */
export const CONTRACTOR_NAVIGATION: NavigationItem[] = [
  {
    id: "contractor-dashboard",
    label: "Dashboard",
    href: ROUTES.contractorDashboard,
  },

  {
    id: "contractor-profile",
    label: "Business Profile",
    href: ROUTES.contractorProfile,
    permission: "MANAGE_PROFILE",
  },

  {
    id: "contractor-projects",
    label: "Projects",
    href: "/contractor/projects",
    permission: "MANAGE_PROJECTS",
  },

  {
    id: "contractor-team",
    label: "Team",
    href: "/contractor/team",
    permission: "MANAGE_TEAM",
  },

  {
    id: "contractor-job-requests",
    label: "Project Requests",
    href: "/contractor/requests",
    permission: "RECEIVE_JOB_REQUESTS",
  },

  {
    id: "contractor-quotations",
    label: "Quotations",
    href: "/contractor/quotations",
    permission: "CREATE_QUOTATIONS",
  },

  {
    id: "contractor-materials",
    label: "Material Requests",
    href: "/contractor/materials",
    permission: "SAVE_PRODUCTS",
  },

  {
    id: "contractor-messages",
    label: "Messages",
    href: ROUTES.messages,
    permission: "SEND_MESSAGES",
  },

  {
    id: "contractor-analytics",
    label: "Business Analytics",
    href: "/contractor/analytics",
    permission: "VIEW_ADVANCED_ANALYTICS",
  },

  {
    id: "contractor-advertising",
    label: "Advertising",
    href: ROUTES.advertise,
    permission: "ADVERTISE",
  },
];

/**
 * Material supplier dashboard navigation.
 */
export const MATERIAL_SUPPLIER_NAVIGATION: NavigationItem[] = [
  {
    id: "supplier-dashboard",
    label: "Dashboard",
    href: ROUTES.supplierDashboard,
  },

  {
    id: "supplier-profile",
    label: "Business Profile",
    href: ROUTES.supplierProfile,
    permission: "MANAGE_PROFILE",
  },

  {
    id: "supplier-products",
    label: "Products",
    href: ROUTES.supplierProducts,
    permission: "MANAGE_PRODUCTS",
  },

  {
    id: "supplier-inventory",
    label: "Inventory",
    href: ROUTES.supplierInventory,
    permission: "MANAGE_INVENTORY",
  },

  {
    id: "supplier-enquiries",
    label: "Customer Enquiries",
    href: "/supplier/enquiries",
    permission: "RECEIVE_MATERIAL_ENQUIRIES",
  },

  {
    id: "supplier-quotations",
    label: "Quotations",
    href: "/supplier/quotations",
    permission: "CREATE_QUOTATIONS",
  },

  {
    id: "supplier-orders",
    label: "Orders",
    href: "/supplier/orders",
  },

  {
    id: "supplier-messages",
    label: "Messages",
    href: ROUTES.messages,
    permission: "SEND_MESSAGES",
  },

  {
    id: "supplier-analytics",
    label: "Business Analytics",
    href: "/supplier/analytics",
    permission: "VIEW_ADVANCED_ANALYTICS",
  },

  {
    id: "supplier-demand",
    label: "Demand Insights",
    href: "/supplier/demand-insights",
    permission: "VIEW_ADVANCED_ANALYTICS",
  },

  {
    id: "supplier-advertising",
    label: "Advertising",
    href: ROUTES.advertise,
    permission: "ADVERTISE",
  },
];

/**
 * Administrator dashboard navigation.
 */
export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    id: "admin-dashboard",
    label: "Platform Overview",
    href: ROUTES.adminDashboard,
  },

  {
    id: "admin-users",
    label: "Users",
    href: ROUTES.adminUsers,
    permission: "MANAGE_USERS",
  },

  {
    id: "admin-verifications",
    label: "Verifications",
    href: "/admin/verifications",
    permission: "MANAGE_VERIFICATIONS",
  },

  {
    id: "admin-categories",
    label: "Categories",
    href: ROUTES.adminCategories,
    permission: "MANAGE_CATEGORIES",
  },

  {
    id: "admin-jobs",
    label: "Jobs",
    href: "/admin/jobs",
  },

  {
    id: "admin-materials",
    label: "Materials",
    href: "/admin/materials",
  },

  {
    id: "admin-conversations",
    label: "Conversations",
    href: "/admin/conversations",
  },

  {
    id: "admin-analytics",
    label: "Platform Analytics",
    href: ROUTES.adminAnalytics,
    permission: "VIEW_PLATFORM_ANALYTICS",
  },

  {
    id: "admin-search-demand",
    label: "Search Demand",
    href: "/admin/search-demand",
    permission: "VIEW_PLATFORM_ANALYTICS",
  },

  {
    id: "admin-memberships",
    label: "Memberships",
    href: "/admin/memberships",
    permission: "MANAGE_MEMBERSHIPS",
  },

  {
    id: "admin-advertisements",
    label: "Advertisements",
    href: "/admin/advertisements",
    permission: "MANAGE_ADVERTISEMENTS",
  },

  {
    id: "admin-reports",
    label: "Reports & Moderation",
    href: "/admin/reports",
  },

  {
    id: "admin-settings",
    label: "Platform Settings",
    href: "/admin/settings",
  },
];

/**
 * Returns the complete dashboard navigation for a role.
 */
export function getNavigationForRole(
  role: UserRole,
): NavigationItem[] {
  switch (role) {
    case "CUSTOMER":
      return CUSTOMER_NAVIGATION;

    case "SKILLED_PROVIDER":
      return SKILLED_PROVIDER_NAVIGATION;

    case "LABOURER":
      return LABOURER_NAVIGATION;

    case "CONTRACTOR":
      return CONTRACTOR_NAVIGATION;

    case "MATERIAL_SUPPLIER":
      return MATERIAL_SUPPLIER_NAVIGATION;

    case "ADMIN":
      return ADMIN_NAVIGATION;

    default:
      return [];
  }
}

/**
 * Removes navigation items that a user cannot access.
 */
export function filterNavigationByPermission(
  navigation: NavigationItem[],
  role?: UserRole | null,
): NavigationItem[] {
  return navigation
    .filter((item) => {
      if (item.isDisabled) {
        return false;
      }

      if (item.visibleToRoles?.length) {
        if (!role || !item.visibleToRoles.includes(role)) {
          return false;
        }
      }

      if (item.permission) {
        return canAccess(role, item.permission);
      }

      if (!role && item.visibleToPublic === false) {
        return false;
      }

      return true;
    })
    .map((item) => ({
      ...item,

      children: item.children
        ? filterNavigationByPermission(
            item.children,
            role,
          )
        : undefined,
    }));
}

/**
 * Returns public navigation filtered for the current visitor.
 */
export function getPublicNavigation(
  role?: UserRole | null,
): NavigationItem[] {
  return filterNavigationByPermission(
    PUBLIC_NAVIGATION,
    role,
  );
}

/**
 * Returns dashboard navigation filtered by role permissions.
 */
export function getDashboardNavigation(
  role: UserRole,
): NavigationItem[] {
  return filterNavigationByPermission(
    getNavigationForRole(role),
    role,
  );
}

/**
 * Finds one navigation item by its unique ID.
 */
export function findNavigationItem(
  navigation: NavigationItem[],
  id: string,
): NavigationItem | undefined {
  for (const item of navigation) {
    if (item.id === id) {
      return item;
    }

    if (item.children?.length) {
      const child = findNavigationItem(
        item.children,
        id,
      );

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}