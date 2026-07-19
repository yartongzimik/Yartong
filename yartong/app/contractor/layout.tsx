import { requireRole } from "../../lib/authz";

export default async function ProtectedRoleAreaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("CONTRACTOR");
  return children;
}
