const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Enquiry = require("../models/Enquiry");
const Product = require("../models/Product");
const Setting = require("../models/Setting");
const { sanitizeText } = require("../utils/sanitize");

async function getEnquiries(_req, res) {
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
  res.json(enquiries.map(({ _id, __v, ...enquiry }) => enquiry));
}

async function createEnquiry(req, res) {
  const settings = await Setting.findOne();
  const name = sanitizeText(req.body.name);
  const email = sanitizeText(req.body.email);
  const phone = sanitizeText(req.body.phone);
  const message = sanitizeText(req.body.message);
  const productId = sanitizeText(req.body.productId);
  const product = productId ? await Product.findOne({ id: productId }).lean() : null;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  if (!settings.gmailUser || !settings.gmailAppPassword) {
    return res.status(400).json({ error: "Admin must add the Gmail app password before receiving enquiries." });
  }

  const enquiry = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    message,
    productId,
    productName: product ? product.name : "General enquiry"
  };

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: settings.gmailUser,
      pass: settings.gmailAppPassword
    }
  });

  try {
    await transport.sendMail({
      from: settings.gmailUser,
      to: settings.contactEmail || settings.gmailUser,
      replyTo: email,
      subject: `New jewellery enquiry from ${name}`,
      text: [
        `Customer: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Product: ${enquiry.productName}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2419;">
          <h2>New jewellery enquiry</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Product:</strong> ${enquiry.productName}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `
    });

    await Enquiry.create(enquiry);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Gmail could not send the enquiry. Check the Gmail app password in admin settings." });
  }
}

module.exports = {
  getEnquiries,
  createEnquiry
};
