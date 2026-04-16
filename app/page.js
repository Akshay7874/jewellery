import StorefrontClient from "@/components/storefront-client";
import { sanitizePublicSettings, serialiseProduct } from "@/lib/helpers";
import { ensureSeeded } from "@/lib/seed";
import Product from "@/models/Product";
import Setting from "@/models/Setting";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();

  const [settingsDoc, productsDocs] = await Promise.all([
    Setting.findOne().lean(),
    Product.find({}).sort({ featured: -1, createdAt: -1 }).lean()
  ]);

  return (
    <StorefrontClient
      initialSettings={sanitizePublicSettings(settingsDoc)}
      initialProducts={productsDocs.map(serialiseProduct)}
    />
  );
}
