import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { fileToDataUrl, serialiseProduct, slugifyProductId } from "@/lib/helpers";
import Product from "@/models/Product";

export async function GET() {
  const products = await Product.find({}).sort({ featured: -1, createdAt: -1 }).lean();
  return NextResponse.json(products.map(serialiseProduct));
}

export async function POST(request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Please log in as admin." }, { status: 401 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const featured = String(formData.get("featured") || "false") === "true";
  const images = formData
    .getAll("images")
    .filter((file) => typeof file === "object" && file.size);

  if (!name || !category || !description || !price) {
    return NextResponse.json({ error: "Name, category, description, and price are required." }, { status: 400 });
  }

  const imageUrls = [];

  for (const image of images) {
    imageUrls.push(await fileToDataUrl(image));
  }

  const imageUrl = imageUrls[0] || "";

  const baseId = slugifyProductId(name);
  let productId = baseId;
  let counter = 1;

  while (await Product.exists({ id: productId })) {
    counter += 1;
    productId = `${baseId}-${counter}`;
  }

  const product = await Product.create({
    id: productId,
    name,
    category,
    description,
    price,
    featured,
    imageUrl,
    imageUrls
  });

  return NextResponse.json(serialiseProduct(product.toObject()), { status: 201 });
}
