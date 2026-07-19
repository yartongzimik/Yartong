import { requireUser } from "../../lib/authz";

export default async function ProtectedRoleAreaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireUser();
  return children;
}
