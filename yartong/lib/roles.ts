import type { RoleDefinition } from "./types";

export const ROLES: Record<string, RoleDefinition> = {
  CUSTOMER: {
    id: "CUSTOMER",
    displayName: "Customer",
    description:
      "Hire skilled workers, contractors, labourers and material suppliers.",

    dashboardPath: "/customer/dashboard",

    permissions: [],

    analyticsAccess: "NONE",

    membershipEligible: true,

    requiresAdminApproval: false,
  },

  SKILLED_PROVIDER: {
    id: "SKILLED_PROVIDER",
    displayName: "Skilled Trade & Service Provider",
    description:
      "Provide skilled construction and professional services to customers.",

    dashboardPath: "/worker/dashboard",

    permissions: [],

    analyticsAccess: "ADVANCED",

    membershipEligible: true,

    requiresAdminApproval: true,
  },

  LABOURER: {
    id: "LABOURER",
    displayName: "Labourer",
    description:
      "Accept daily wage, temporary and contract-based work opportunities.",

    dashboardPath: "/labourer/dashboard",

    permissions: [],

    analyticsAccess: "BASIC",

    membershipEligible: true,

    requiresAdminApproval: true,
  },

  CONTRACTOR: {
    id: "CONTRACTOR",
    displayName: "Contractor",
    description:
      "Manage projects, teams and provide construction services.",

    dashboardPath: "/contractor/dashboard",

    permissions: [],

    analyticsAccess: "ADVANCED",

    membershipEligible: true,

    requiresAdminApproval: true,
  },

  MATERIAL_SUPPLIER: {
    id: "MATERIAL_SUPPLIER",
    displayName: "Material Supplier",
    description:
      "Sell and manage construction materials through Yartong.",

    dashboardPath: "/supplier/dashboard",

    permissions: [],

    analyticsAccess: "ADVANCED",

    membershipEligible: true,

    requiresAdminApproval: true,
  },

  ADMIN: {
    id: "ADMIN",
    displayName: "Administrator",
    description:
      "Manage and operate the Yartong platform.",

    dashboardPath: "/admin",

    permissions: [],

    analyticsAccess: "PLATFORM",

    membershipEligible: false,

    requiresAdminApproval: false,
  },
};

export function getRole(id: keyof typeof ROLES): RoleDefinition {
  return ROLES[id];
}

export function getAllRoles(): RoleDefinition[] {
  return Object.values(ROLES);
}

export function getPublicRoles(): RoleDefinition[] {
  return getAllRoles().filter(
    (role) => role.id !== "ADMIN",
  );
}

export function isBusinessRole(roleId: keyof typeof ROLES): boolean {
  return [
    "SKILLED_PROVIDER",
    "CONTRACTOR",
    "MATERIAL_SUPPLIER",
  ].includes(roleId);
}

export function hasDashboard(roleId: keyof typeof ROLES): boolean {
  return ROLES[roleId].dashboardPath.length > 0;
}

export function requiresApproval(roleId: keyof typeof ROLES): boolean {
  return ROLES[roleId].requiresAdminApproval;
}

export function hasAdvancedAnalytics(
  roleId: keyof typeof ROLES,
): boolean {
  return (
    ROLES[roleId].analyticsAccess === "ADVANCED" ||
    ROLES[roleId].analyticsAccess === "PLATFORM"
  );
}