const ADMIN_EMAIL = "akshaykar7874@gmail.com";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

const defaultSettings = {
  brandName: "Muskan Jewellery",
  sellerName: "Muskan",
  heroTitle: "Gold and silver jewellery that turns every glance into a celebration.",
  heroText:
    "Muskan Jewellery presents bridal sparkle, festive statements, and everyday heirlooms with a luxurious online shopping experience.",
  accentNote: "Curated by Muskan for weddings, gifting, and unforgettable occasions.",
  boutiqueLocation: "Delhi, India",
  contactEmail: ADMIN_EMAIL,
  gmailUser: ADMIN_EMAIL,
  gmailAppPassword: "",
  whatsappNumber: "+91 98765 43210",
  atelierNote: "Handpicked gold, silver, polki, and festive sets styled with boutique attention.",
  metalsNote: "Gold brilliance, silver glow, and bridal craftsmanship in one destination."
};

const defaultProducts = [
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
    description: "Lightweight statement earrings designed for sangeet, gifting, and festive styling.",
    price: 18499,
    featured: false,
    imageUrl: ""
  }
];

module.exports = {
  ADMIN_EMAIL,
  SESSION_MAX_AGE_MS,
  defaultSettings,
  defaultProducts
};
