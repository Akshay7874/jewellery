export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "akshaykar7874@gmail.com";
export const SESSION_COOKIE_NAME = "muskan_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const defaultSettings = {
  brandName: "Muskan Jewellery",
  sellerName: "Muskan",
  heroTitle: "Gold and silver jewellery that turns every glance into a celebration.",
  heroText:
    "Muskan Jewellery brings bridal sparkle, gifting elegance, and festive luxury into one premium online showroom.",
  accentNote: "Curated by Muskan for weddings, gifting, and unforgettable occasions.",
  boutiqueLocation: "Delhi, India",
  contactEmail: ADMIN_EMAIL,
  gmailUser: ADMIN_EMAIL,
  gmailAppPassword: "",
  whatsappNumber: "+91 98765 43210",
  atelierNote: "Handpicked gold, silver, polki, and festive sets styled with boutique attention.",
  metalsNote: "Gold brilliance, silver glow, and bridal craftsmanship in one destination."
};

export const defaultProducts = [
  {
    id: "muskan-bridal-radiance",
    name: "Muskan Bridal Radiance Set",
    category: "Bridal Gold",
    description: "Layered necklace, earrings, and maang tikka styled for grand wedding entries.",
    price: 148000,
    featured: true,
    imageUrl: ""
  },
  {
    id: "silver-moonlight-choker",
    name: "Silver Moonlight Choker",
    category: "Silver Edit",
    description: "A luminous choker with polished silver curves and evening-ready shine.",
    price: 32999,
    featured: true,
    imageUrl: ""
  },
  {
    id: "golden-blossom-earrings",
    name: "Golden Blossom Earrings",
    category: "Festive Gold",
    description: "Lightweight statement earrings designed for gifting, weddings, and festive styling.",
    price: 18499,
    featured: false,
    imageUrl: ""
  }
];
