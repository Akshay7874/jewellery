import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { serialiseEnquiry, slugifyProductId } from "@/lib/helpers";
import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import Setting from "@/models/Setting";

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  const productId = String(body.productId || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const [settings, product] = await Promise.all([
    Setting.findOne(),
    productId ? Product.findOne({ id: productId }) : null
  ]);

  const productName = product?.name || "General Jewellery Enquiry";

  const enquiry = await Enquiry.create({
    id: `${slugifyProductId(name)}-${Date.now()}`,
    name,
    email,
    phone,
    message,
    productId,
    productName
  });

  let mailSent = false;

  if (settings?.gmailUser && settings?.gmailAppPassword) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: settings.gmailUser,
        pass: settings.gmailAppPassword
      }
    });

    await transporter.sendMail({
      from: settings.gmailUser,
      to: settings.contactEmail || settings.gmailUser,
      replyTo: email,
      subject: `New enquiry for ${productName}`,
      text: [
        `Customer: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Product: ${productName}`,
        "",
        message
      ].join("\n")
    });

    mailSent = true;
  }

  return NextResponse.json({
    ok: true,
    enquiry: serialiseEnquiry(enquiry.toObject()),
    message: mailSent ? "Enquiry sent successfully." : "Enquiry saved. Add Gmail app password in admin settings to send email copies."
  });
}
