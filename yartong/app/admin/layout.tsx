import { requireRole } from "../../lib/authz";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("ADMIN");
  return children;
}
