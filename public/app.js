const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const state = {
  settings: null,
  products: [],
  enquiries: [],
  adminStatus: null,
  session: null,
  carouselIndex: 0,
  carouselTimer: null,
  activeCategory: "all",
  activeMetal: "all",
  searchQuery: ""
};

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

function revealPage() {
  document.body.classList.remove("page-pending");
  document.body.classList.add("page-ready");
}

function formatPrice(value) {
  return currencyFormatter.format(value || 0);
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function inferMetal(product) {
  const haystack = normalizeText([product.category, product.name, product.description].join(" "));

  if (haystack.includes("silver")) {
    return "silver";
  }

  if (haystack.includes("gold") || haystack.includes("bridal") || haystack.includes("polki")) {
    return "gold";
  }

  return "all";
}

function getAvailableCategories() {
  return [...new Set(state.products.map((product) => product.category).filter(Boolean))];
}

function hasActiveStorefrontFilters() {
  return state.activeCategory !== "all" || state.activeMetal !== "all" || Boolean(state.searchQuery);
}

function getFilteredProducts() {
  return state.products.filter((product) => {
    const matchesCategory = state.activeCategory === "all" || product.category === state.activeCategory;
    const productMetal = inferMetal(product);
    const matchesMetal =
      state.activeMetal === "all" ||
      productMetal === state.activeMetal ||
      (state.activeMetal === "gold" && productMetal === "all");
    const haystack = normalizeText([product.name, product.category, product.description].join(" "));
    const matchesSearch = !state.searchQuery || haystack.includes(state.searchQuery);

    return matchesCategory && matchesMetal && matchesSearch;
  });
}

function getCarouselSourceProducts() {
  const filteredProducts = getFilteredProducts();
  const scopedProducts = filteredProducts.length ? filteredProducts : state.products;
  const featuredProducts = scopedProducts.filter((product) => product.featured);

  return (featuredProducts.length ? featuredProducts : scopedProducts).slice(0, 4);
}

function renderProductVisual(product, variant = "grid") {
  if (product.imageUrl) {
    const mediaClass = variant === "rail" ? "mini-card__image" : "collection-card__media";
    return `<img class="${mediaClass}" src="${product.imageUrl}" alt="${product.name}" />`;
  }

  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const metal = inferMetal(product);
  const placeholderClass = variant === "rail" ? "mini-card__placeholder" : "collection-card__placeholder";

  return `
    <div class="${placeholderClass} ${placeholderClass}--${metal}">
      <span>${initials}</span>
    </div>
  `;
}

function getCarouselSlides() {
  return getCarouselSourceProducts().map((product, index) => {
    const labels = [
      "Wedding Spotlight",
      "Silver Signature",
      "Festive Bestseller",
      "Gift Edit"
    ];
    const offers = [
      { title: "Flat 20%", note: "On bridal feature edits" },
      { title: "Direct Enquiry", note: "Mail Muskan instantly" },
      { title: "Style Support", note: "Occasion-led recommendations" },
      { title: "Fast Discovery", note: "Browse premium designs" }
    ];

    return {
      id: product.id,
      eyebrow: labels[index] || "Jewellery Spotlight",
      title: product.name,
      description: product.description,
      category: product.category,
      price: formatPrice(product.price),
      imageUrl: product.imageUrl,
      metal: inferMetal(product),
      offer: offers[index] || offers[0]
    };
  });
}

function renderStorefrontChrome() {
  const catalogNav = document.getElementById("catalogNav");
  const categoryChips = document.getElementById("categoryChips");
  const collectionStatus = document.getElementById("collectionStatus");
  const filteredProducts = getFilteredProducts();
  const categories = getAvailableCategories();

  if (catalogNav) {
    catalogNav.innerHTML = [
      `<button class="catalog-link ${state.activeCategory === "all" ? "is-active" : ""}" data-category="all" type="button">All Jewellery</button>`,
      ...categories.map(
        (category) =>
          `<button class="catalog-link ${state.activeCategory === category ? "is-active" : ""}" data-category="${category}" type="button">${category}</button>`
      )
    ].join("");
  }

  if (categoryChips) {
    const chipSource = filteredProducts.length ? filteredProducts : state.products;
    const chipCategories = [...new Set(chipSource.map((product) => product.category))].slice(0, 4);

    categoryChips.innerHTML = chipCategories.length
      ? chipCategories.map((category) => `<span>${category}</span>`).join("")
      : `<span>Bridal Gold</span><span>Silver Luxe</span><span>Gift Edit</span>`;
  }

  if (collectionStatus) {
    const visibleCount = filteredProducts.length;
    collectionStatus.textContent = visibleCount
      ? `${visibleCount} jewellery design${visibleCount > 1 ? "s" : ""} matching your selection.`
      : hasActiveStorefrontFilters()
        ? "No exact matches found yet - the hero carousel is still showing Muskan's signature highlights."
        : "Discover Muskan's latest jewellery highlights and featured edits.";
  }

  document.querySelectorAll("#metalFilters [data-metal]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.metal === state.activeMetal);
  });
}

function renderCarousel() {
  const carouselTrack = document.getElementById("carouselTrack");
  const carouselNav = document.getElementById("carouselNav");

  if (!carouselTrack || !carouselNav) {
    return;
  }

  const slides = getCarouselSlides();

  if (!slides.length) {
    carouselTrack.innerHTML = `
      <article class="carousel-slide is-active">
        <div class="carousel-stage">
          <div class="carousel-stage__backdrop"></div>
          <div class="carousel-stage__visual">
            <div class="carousel-ring"></div>
            <div class="carousel-gem"></div>
          </div>
        </div>
        <div class="carousel-copy">
          <p class="eyebrow">Luxury Launch</p>
          <h2>Upload jewellery from the admin panel to create a premium automatic carousel.</h2>
          <p>Your landing page will build large animated slides here as soon as products are added.</p>
        </div>
      </article>
    `;
    carouselNav.innerHTML = "";
    return;
  }

  if (state.carouselIndex >= slides.length) {
    state.carouselIndex = 0;
  }

  carouselTrack.innerHTML = slides
    .map(
      (slide, index) => `
        <article class="carousel-slide ${index === state.carouselIndex ? "is-active" : ""}" data-slide-index="${index}">
          <div class="carousel-stage carousel-stage--${slide.metal}">
            ${slide.imageUrl ? `<img class="carousel-panel__image" src="${slide.imageUrl}" alt="${slide.title}" />` : `<div class="carousel-stage__backdrop"></div>`}
            ${slide.imageUrl ? `<div class="carousel-panel__overlay"></div>` : ""}
            <div class="carousel-stage__visual">
              ${slide.imageUrl ? "" : `<div class="carousel-ring"></div><div class="carousel-gem"></div>`}
            </div>
            <div class="carousel-stage__stamp">
              <span>By Muskan</span>
              <strong>${slide.category}</strong>
            </div>
          </div>
          <div class="carousel-copy">
            <p class="eyebrow">${slide.eyebrow}</p>
            <h2>${slide.title}</h2>
            <p>${slide.description}</p>
            <div class="carousel-copy__meta">
              <span class="carousel-panel__tag">${slide.category}</span>
              <span class="carousel-price">${slide.price}</span>
            </div>
            <div class="carousel-offer">
              <div>
                <strong>${slide.offer.title}</strong>
                <span>${slide.offer.note}</span>
              </div>
              <div>
                <strong>Premium UI</strong>
                <span>Animated landing showcase</span>
              </div>
            </div>
            <div class="carousel-copy__actions">
              <a class="button button--solid" href="#collections">Explore Jewellery</a>
              <button class="button button--glass" data-enquiry-id="${slide.id}" type="button">Ask About This Piece</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  carouselNav.innerHTML = slides
    .map(
      (slide, index) => `
        <button class="carousel-dot ${index === state.carouselIndex ? "is-active" : ""}" data-carousel-dot="${index}" type="button" aria-label="Go to slide ${index + 1}">
          <span class="carousel-dot__count">0${index + 1}</span>
          <span class="carousel-dot__label">${slide.category}</span>
        </button>
      `
    )
    .join("");

  updateCarouselPosition();

  document.querySelectorAll("[data-carousel-dot]").forEach((button) => {
    button.addEventListener("click", () => {
      state.carouselIndex = Number(button.dataset.carouselDot);
      updateCarouselPosition();
      restartCarousel();
    });
  });

  carouselTrack.querySelectorAll("[data-enquiry-id]").forEach((button) => {
    button.addEventListener("click", () => openEnquiry(button.dataset.enquiryId));
  });
}

function renderFeaturedRail() {
  const featuredRail = document.getElementById("featuredRail");

  if (!featuredRail) {
    return;
  }

  const filteredProducts = getFilteredProducts();
  const sourceProducts = (filteredProducts.length ? filteredProducts : state.products).slice(0, 8);

  if (!sourceProducts.length) {
    featuredRail.innerHTML = `<div class="empty-state">Upload jewellery from the admin panel to create the moving discovery rail.</div>`;
    featuredRail.classList.remove("is-animated");
    return;
  }

  const railProducts = sourceProducts.length > 3 ? [...sourceProducts, ...sourceProducts] : sourceProducts;

  featuredRail.innerHTML = railProducts
    .map(
      (product) => `
        <article class="mini-card" data-enquiry-id="${product.id}">
          ${renderProductVisual(product, "rail")}
          <div class="mini-card__body">
            <span class="mini-card__category">${product.category}</span>
            <h3>${product.name}</h3>
            <strong>${formatPrice(product.price)}</strong>
          </div>
        </article>
      `
    )
    .join("");

  featuredRail.classList.toggle("is-animated", sourceProducts.length > 3);

  featuredRail.querySelectorAll("[data-enquiry-id]").forEach((card) => {
    card.addEventListener("click", () => openEnquiry(card.dataset.enquiryId));
  });
}

function updateCarouselPosition() {
  const carouselTrack = document.getElementById("carouselTrack");
  const dots = document.querySelectorAll("[data-carousel-dot]");
  const slides = carouselTrack?.querySelectorAll(".carousel-slide") || [];

  if (!carouselTrack) {
    return;
  }

  carouselTrack.style.transform = `translateX(-${state.carouselIndex * 100}%)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === state.carouselIndex);
  });

  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === state.carouselIndex);
  });
}

function moveCarousel(direction) {
  const slides = getCarouselSlides();

  if (!slides.length) {
    return;
  }

  const nextIndex = state.carouselIndex + direction;
  state.carouselIndex = (nextIndex + slides.length) % slides.length;
  updateCarouselPosition();
  restartCarousel();
}

function startCarousel() {
  const slides = getCarouselSlides();

  if (slides.length < 2) {
    return;
  }

  state.carouselTimer = window.setInterval(() => {
    state.carouselIndex = (state.carouselIndex + 1) % slides.length;
    updateCarouselPosition();
  }, 5200);
}

function restartCarousel() {
  if (state.carouselTimer) {
    window.clearInterval(state.carouselTimer);
    state.carouselTimer = null;
  }

  startCarousel();
}

function renderProductGrid(products) {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) {
    return;
  }

  if (!products.length) {
    productGrid.innerHTML = `<div class="empty-state">No jewellery matches this search yet. Try another category or clear the search box.</div>`;
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="collection-card">
          ${renderProductVisual(product)}
          <div class="collection-card__body">
            <div class="collection-card__meta">
              <span>${product.category}</span>
              ${product.featured ? `<span class="price-badge">Featured</span>` : ""}
            </div>
            <div>
              <h3>${product.name}</h3>
              <p>${product.description}</p>
            </div>
            <div class="collection-card__footer">
              <strong class="price">${formatPrice(product.price)}</strong>
              <button class="button button--glass" data-enquiry-id="${product.id}" type="button">Enquire</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  productGrid.querySelectorAll("[data-enquiry-id]").forEach((button) => {
    button.addEventListener("click", () => openEnquiry(button.dataset.enquiryId));
  });
}

function renderStorefront() {
  const settings = state.settings;

  if (settings) {
    document.title = settings.brandName || "Muskan Jewellery";
    document.getElementById("brandName").textContent = settings.brandName;
    document.getElementById("sellerName").textContent = settings.sellerName;
    document.getElementById("heroTitle").textContent = settings.heroTitle;
    document.getElementById("heroText").textContent = settings.heroText;
    document.getElementById("accentNote").textContent = settings.accentNote;
    document.getElementById("metalsNote").textContent = settings.metalsNote;
    document.getElementById("atelierNote").textContent = settings.atelierNote;
    document.getElementById("boutiqueLocation").textContent = settings.boutiqueLocation;
    document.getElementById("contactEmail").textContent = settings.contactEmail;
    document.getElementById("whatsappNumber").textContent = settings.whatsappNumber;
  }

  const filteredProducts = getFilteredProducts();
  const gridProducts = hasActiveStorefrontFilters() ? filteredProducts : state.products;

  renderStorefrontChrome();
  renderCarousel();
  renderFeaturedRail();
  renderProductGrid(gridProducts);
}

function applyStorefrontFilters() {
  state.carouselIndex = 0;
  renderStorefront();
  restartCarousel();
}

function openEnquiry(productId = "") {
  const modal = document.getElementById("enquiryModal");
  const productIdField = document.getElementById("selectedProductId");
  const heading = document.getElementById("enquiryHeading");
  const product = state.products.find((item) => item.id === productId);

  if (!modal || !productIdField || !heading) {
    return;
  }

  productIdField.value = productId;
  heading.textContent = product ? `Ask about ${product.name}` : "Start a jewellery consultation";
  modal.showModal();
}

function bindStorefrontEvents() {
  const openGeneralEnquiry = document.getElementById("openGeneralEnquiry");
  const contactEnquiry = document.getElementById("contactEnquiry");
  const closeModal = document.getElementById("closeModal");
  const modal = document.getElementById("enquiryModal");
  const enquiryForm = document.getElementById("enquiryForm");
  const enquiryMessage = document.getElementById("enquiryMessage");
  const carouselPrev = document.getElementById("carouselPrev");
  const carouselNext = document.getElementById("carouselNext");
  const showcaseCarousel = document.getElementById("showcaseCarousel");
  const storeSearch = document.getElementById("storeSearch");
  const catalogNav = document.getElementById("catalogNav");
  const metalFilters = document.getElementById("metalFilters");

  openGeneralEnquiry?.addEventListener("click", () => openEnquiry());
  contactEnquiry?.addEventListener("click", () => openEnquiry());
  closeModal?.addEventListener("click", () => modal.close());
  carouselPrev?.addEventListener("click", () => moveCarousel(-1));
  carouselNext?.addEventListener("click", () => moveCarousel(1));

  storeSearch?.addEventListener("input", (event) => {
    state.searchQuery = normalizeText(event.target.value);
    applyStorefrontFilters();
  });

  catalogNav?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) {
      return;
    }

    state.activeCategory = button.dataset.category;
    applyStorefrontFilters();
  });

  metalFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-metal]");

    if (!button) {
      return;
    }

    state.activeMetal = button.dataset.metal;
    applyStorefrontFilters();
  });

  showcaseCarousel?.addEventListener("mouseenter", () => {
    if (state.carouselTimer) {
      window.clearInterval(state.carouselTimer);
      state.carouselTimer = null;
    }
  });

  showcaseCarousel?.addEventListener("mouseleave", () => {
    restartCarousel();
  });

  modal?.addEventListener("click", (event) => {
    const bounds = enquiryForm.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) {
      modal.close();
    }
  });

  enquiryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    enquiryMessage.textContent = "Sending enquiry...";

    try {
      const payload = Object.fromEntries(new FormData(enquiryForm).entries());
      await fetchJson("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      enquiryMessage.textContent = "Enquiry sent successfully.";
      enquiryForm.reset();

      setTimeout(() => {
        enquiryMessage.textContent = "";
        modal.close();
      }, 1200);
    } catch (error) {
      enquiryMessage.textContent = error.message;
    }
  });
}

async function loadStorefrontData() {
  const [settings, products] = await Promise.all([fetchJson("/api/settings"), fetchJson("/api/products")]);
  state.settings = settings;
  state.products = products;
  renderStorefront();
  restartCarousel();
}

async function loadAdminStatus() {
  const status = await fetchJson("/api/admin/status");
  state.adminStatus = status;
  document.getElementById("adminEmailDisplay").textContent = status.email;
  document.getElementById("setupForm").hidden = status.hasPassword;
  document.getElementById("loginForm").hidden = !status.hasPassword;
  revealPage();
}

function bindAdminLoginEvents() {
  const setupForm = document.getElementById("setupForm");
  const loginForm = document.getElementById("loginForm");
  const setupMessage = document.getElementById("setupMessage");
  const loginMessage = document.getElementById("loginMessage");

  setupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setupMessage.textContent = "Creating admin password...";

    try {
      const payload = Object.fromEntries(new FormData(setupForm).entries());
      await fetchJson("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      window.location.href = "/admin.html";
    } catch (error) {
      setupMessage.textContent = error.message;
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "Opening admin panel...";

    try {
      const payload = Object.fromEntries(new FormData(loginForm).entries());
      await fetchJson("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      window.location.href = "/admin.html";
    } catch (error) {
      loginMessage.textContent = error.message;
    }
  });
}

async function ensureAdminSession() {
  try {
    const session = await fetchJson("/api/admin/session");
    state.session = session;
    return session;
  } catch (error) {
    window.location.replace("/login.html");
    return null;
  }
}

function renderAdminProducts() {
  const list = document.getElementById("adminProductList");

  if (!state.products.length) {
    list.innerHTML = `<div class="empty-state">Products uploaded here will appear on the landing page automatically.</div>`;
    return;
  }

  list.innerHTML = state.products
    .map(
      (product) => `
        <article class="admin-grid__card">
          ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" />` : `<div class="collection-card__placeholder">${product.name.slice(0, 2).toUpperCase()}</div>`}
          <span class="admin-grid__meta">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="price">${formatPrice(product.price)}</p>
          <button class="button button--glass danger-button" data-delete-id="${product.id}" type="button">Delete</button>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => deleteProduct(button.dataset.deleteId));
  });
}

function renderAdminEnquiries() {
  const list = document.getElementById("enquiryList");

  if (!state.enquiries.length) {
    list.innerHTML = `<div class="empty-state">Customer enquiries that successfully reach Gmail will appear here.</div>`;
    return;
  }

  list.innerHTML = state.enquiries
    .map(
      (enquiry) => `
        <article class="admin-stack__card">
          <span class="admin-stack__time">${formatDate(enquiry.createdAt)}</span>
          <h3>${enquiry.name} - ${enquiry.productName}</h3>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone || "Not provided"}</p>
          <p>${enquiry.message}</p>
        </article>
      `
    )
    .join("");
}

function fillSettingsForm() {
  const form = document.getElementById("settingsForm");

  Object.entries(state.settings).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });

  if (state.session) {
    document.getElementById("sessionEmail").textContent = state.session.email;
  }
}

function bindAdminEvents() {
  const settingsForm = document.getElementById("settingsForm");
  const settingsMessage = document.getElementById("settingsMessage");
  const productForm = document.getElementById("productForm");
  const productMessage = document.getElementById("productMessage");
  const passwordForm = document.getElementById("passwordForm");
  const passwordMessage = document.getElementById("passwordMessage");
  const logoutButton = document.getElementById("logoutButton");

  settingsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    settingsMessage.textContent = "Saving settings...";

    try {
      const payload = Object.fromEntries(new FormData(settingsForm).entries());
      state.settings = await fetchJson("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      settingsMessage.textContent = "Storefront settings saved.";
    } catch (error) {
      settingsMessage.textContent = error.message;
    }
  });

  productForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    productMessage.textContent = "Uploading jewellery...";

    try {
      const formData = new FormData(productForm);
      formData.set("featured", String(formData.get("featured") === "true"));

      await fetchJson("/api/products", {
        method: "POST",
        body: formData
      });

      productMessage.textContent = "Jewellery uploaded.";
      productForm.reset();
      await loadAdminDashboard();
    } catch (error) {
      productMessage.textContent = error.message;
    }
  });

  passwordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    passwordMessage.textContent = "Updating password...";

    try {
      const payload = Object.fromEntries(new FormData(passwordForm).entries());
      await fetchJson("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      passwordForm.reset();
      passwordMessage.textContent = "Admin password updated.";
    } catch (error) {
      passwordMessage.textContent = error.message;
    }
  });

  logoutButton?.addEventListener("click", async () => {
    await fetchJson("/api/admin/logout", { method: "POST" });
    window.location.href = "/login.html";
  });
}

async function deleteProduct(productId) {
  const confirmed = window.confirm("Delete this jewellery item from the storefront?");

  if (!confirmed) {
    return;
  }

  try {
    await fetchJson(`/api/products/${productId}`, { method: "DELETE" });
    await loadAdminDashboard();
  } catch (error) {
    window.alert(error.message);
  }
}

async function loadAdminDashboard() {
  const session = await ensureAdminSession();

  if (!session) {
    return;
  }

  const [settings, products, enquiries] = await Promise.all([
    fetchJson("/api/admin/settings"),
    fetchJson("/api/products"),
    fetchJson("/api/enquiries")
  ]);

  state.session = session;
  state.settings = settings;
  state.products = products;
  state.enquiries = enquiries;

  fillSettingsForm();
  renderAdminProducts();
  renderAdminEnquiries();
  revealPage();
}

async function init() {
  const page = document.body.dataset.page;

  if (page === "storefront") {
    await loadStorefrontData();
    bindStorefrontEvents();
    revealPage();
  }

  if (page === "admin-login") {
    await loadAdminStatus();
    bindAdminLoginEvents();
  }

  if (page === "admin") {
    await loadAdminDashboard();
    bindAdminEvents();
  }
}

init().catch((error) => {
  revealPage();
  console.error(error);
});
