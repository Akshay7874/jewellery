import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/constants";
import { serialiseSettings } from "@/lib/helpers";
import Setting from "@/models/Setting";

export async function PUT(request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Please log in as admin." }, { status: 401 });
  }

  const body = await request.json();

  const update = {
    brandName: String(body.brandName || "").trim(),
    sellerName: String(body.sellerName || "").trim(),
    heroTitle: String(body.heroTitle || "").trim(),
    heroText: String(body.heroText || "").trim(),
    accentNote: String(body.accentNote || "").trim(),
    boutiqueLocation: String(body.boutiqueLocation || "").trim(),
    contactEmail: String(body.contactEmail || "").trim(),
    gmailUser: ADMIN_EMAIL,
    whatsappNumber: String(body.whatsappNumber || "").trim(),
    atelierNote: String(body.atelierNote || "").trim(),
    metalsNote: String(body.metalsNote || "").trim()
  };

  const nextPasswordValue = String(body.gmailAppPassword || "").trim();

  for (const [key, value] of Object.entries(update)) {
    if (!value && key !== "whatsappNumber") {
      return NextResponse.json({ error: `${key} is required.` }, { status: 400 });
    }
  }

  const settings = await Setting.findOne();
  Object.assign(settings, update);

  if (nextPasswordValue) {
    settings.gmailAppPassword = nextPasswordValue;
  }

  await settings.save();

  return NextResponse.json(serialiseSettings(settings.toObject()));
}
