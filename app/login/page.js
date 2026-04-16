import { redirect } from "next/navigation";
import AdminAuth from "@/components/admin-auth";
import { getAdminStatus, getCurrentAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getCurrentAdminSession();

  if (session) {
    redirect("/admin");
  }

  const status = await getAdminStatus();

  return <AdminAuth email={status.email} hasPassword={status.hasPassword} />;
}
