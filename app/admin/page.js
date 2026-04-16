import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin-dashboard";
import { getCurrentAdminSession } from "@/lib/auth";
import { serialiseEnquiry, serialiseProduct, serialiseSettings } from "@/lib/helpers";
import { ensureSeeded } from "@/lib/seed";
import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import Setting from "@/models/Setting";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getCurrentAdminSession();

  if (!session) {
    redirect("/login");
  }

  await ensureSeeded();

  const [settingsDoc, productsDocs, enquiriesDocs] = await Promise.all([
    Setting.findOne().lean(),
    Product.find({}).sort({ featured: -1, createdAt: -1 }).lean(),
    Enquiry.find({}).sort({ createdAt: -1 }).lean()
  ]);

  return (
    <AdminDashboard
      sessionEmail={session.email}
      settings={serialiseSettings(settingsDoc)}
      products={productsDocs.map(serialiseProduct)}
      enquiries={enquiriesDocs.map(serialiseEnquiry)}
    />
  );
}
