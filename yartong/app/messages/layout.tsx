import { requirePermission } from "../../lib/authz";

export default async function MessagesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePermission("SEND_MESSAGES");
  return children;
}
