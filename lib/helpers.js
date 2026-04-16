export function sanitizePublicSettings(settings) {
  return {
    brandName: settings.brandName,
    sellerName: settings.sellerName,
    heroTitle: settings.heroTitle,
    heroText: settings.heroText,
    accentNote: settings.accentNote,
    boutiqueLocation: settings.boutiqueLocation,
    contactEmail: settings.contactEmail,
    whatsappNumber: settings.whatsappNumber,
    atelierNote: settings.atelierNote,
    metalsNote: settings.metalsNote
  };
}

export function serialiseProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    featured: Boolean(product.featured),
    imageUrl: product.imageUrl || "",
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : null
  };
}

export function serialiseSettings(settings) {
  return {
    brandName: settings.brandName,
    sellerName: settings.sellerName,
    heroTitle: settings.heroTitle,
    heroText: settings.heroText,
    accentNote: settings.accentNote,
    boutiqueLocation: settings.boutiqueLocation,
    contactEmail: settings.contactEmail,
    gmailUser: settings.gmailUser,
    gmailAppPassword: "",
    whatsappNumber: settings.whatsappNumber,
    atelierNote: settings.atelierNote,
    metalsNote: settings.metalsNote
  };
}

export function serialiseEnquiry(enquiry) {
  return {
    id: enquiry.id,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    message: enquiry.message,
    productId: enquiry.productId,
    productName: enquiry.productName,
    createdAt: enquiry.createdAt ? new Date(enquiry.createdAt).toISOString() : null
  };
}

export function slugifyProductId(value) {
  return String(value || "product")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "product";
}

export async function fileToDataUrl(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
