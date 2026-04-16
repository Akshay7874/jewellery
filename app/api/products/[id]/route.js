import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import Product from "@/models/Product";

export async function DELETE(_request, context) {
  const { id } = await context.params;
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Please log in as admin." }, { status: 401 });
  }

  await Product.deleteOne({ id });
  return NextResponse.json({ ok: true });
}
