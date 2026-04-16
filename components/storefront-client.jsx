"use client";

import { useEffect, useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function formatPrice(value) {
  return currencyFormatter.format(value || 0);
}

function inferMetal(product) {
  const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();

  if (haystack.includes("silver")) {
    return "silver";
  }

  if (haystack.includes("gold") || haystack.includes("bridal") || haystack.includes("polki")) {
    return "gold";
  }

  return "all";
}

function ProductArt({ product, className = "product-art" }) {
  if (product.imageUrl) {
    return <img className={className} src={product.imageUrl} alt={product.name} />;
  }

  return (
    <div className={`${className} product-art--placeholder product-art--${inferMetal(product)}`}>
      <span>{product.name.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export default function StorefrontClient({ initialSettings, initialProducts }) {
  const [settings] = useState(initialSettings);
  const [products] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMetal, setActiveMetal] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const categories = useMemo(
    () => ["all", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const metal = inferMetal(product);
      const matchesMetal = activeMetal === "all" || metal === activeMetal || (activeMetal === "gold" && metal === "all");
      const matchesSearch = !searchQuery || haystack.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesMetal && matchesSearch;
    });
  }, [products, activeCategory, activeMetal, searchQuery]);

  const carouselProducts = useMemo(() => {
    const source = filteredProducts.length ? filteredProducts : products;
    const featured = source.filter((product) => product.featured);
    return (featured.length ? featured : source).slice(0, 4);
  }, [filteredProducts, products]);

  const railProducts = useMemo(() => {
    const source = filteredProducts.length ? filteredProducts : products;
    return source.slice(0, 8);
  }, [filteredProducts, products]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  useEffect(() => {
    if (carouselProducts.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % carouselProducts.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [carouselProducts.length]);

  useEffect(() => {
    if (slideIndex >= carouselProducts.length) {
      setSlideIndex(0);
    }
  }, [carouselProducts.length, slideIndex]);

  const currentSlides = carouselProducts.length ? carouselProducts : products.slice(0, 1);

  async function handleEnquirySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    setIsSending(true);
    setFormMessage("Sending enquiry...");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send enquiry.");
      }

      setFormMessage(data.message || "Enquiry sent successfully.");
      event.currentTarget.reset();
      setSelectedProductId("");

      window.setTimeout(() => {
        setModalOpen(false);
        setFormMessage("");
      }, 1400);
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      setIsSending(false);
    }
  }

  function openEnquiry(productId = "") {
    setSelectedProductId(productId);
    setFormMessage("");
    setModalOpen(true);
  }

  return (
    <div className="page-shell">
      <div className="announcement-bar">
        <div className="container announcement-bar__inner">
          <span>{settings.accentNote}</span>
          <span>{settings.metalsNote}</span>
          <span>Jewellery sold by {settings.sellerName}</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__top">
          <a className="brandmark" href="#top">
            <span className="brandmark__logo">MJ</span>
            <span>
              <strong>{settings.brandName}</strong>
              <small>Jewellery sold by {settings.sellerName}</small>
            </span>
          </a>

          <div className="header-tools">
            <button className="header-pill" type="button">
              <span>Where to deliver?</span>
              <strong>Update Pincode</strong>
            </button>

            <label className="search-box" htmlFor="catalog-search">
              <span>Search catalogue</span>
              <input
                id="catalog-search"
                type="search"
                placeholder='Search "rings", "sets", "silver"'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>

            <nav className="top-links">
              <a href="#collections">Collections</a>
              <a href="#story">Muskan</a>
              <a href="#contact">Contact</a>
              <a href="/login">Admin</a>
            </nav>
          </div>
        </div>

        <div className="container category-strip">
          <div className="category-strip__nav">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? "is-active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category === "all" ? "All Jewellery" : category}
              </button>
            ))}
          </div>

          <div className="metal-switcher">
            {[
              { label: "All Jewellery", value: "all" },
              { label: "Silver Jewellery", value: "silver" },
              { label: "Gold Jewellery", value: "gold" }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={activeMetal === item.value ? "is-active" : ""}
                onClick={() => setActiveMetal(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="top">
        <section className="showcase-section">
          <div className="container">
            <div className="showcase-heading">
              <div>
                <span className="eyebrow">Premium Edit</span>
                <h1>{settings.heroTitle}</h1>
              </div>
              <p>{settings.heroText}</p>
            </div>

            <div className="showcase-carousel">
              <div className="showcase-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
                {currentSlides.map((product, index) => (
                  <article className="showcase-slide" key={product.id || index}>
                    <div className={`showcase-slide__visual showcase-slide__visual--${inferMetal(product)}`}>
                      <ProductArt product={product} className="showcase-image" />
                      <div className="showcase-badge">
                        <span>By {settings.sellerName}</span>
                        <strong>{product.category}</strong>
                      </div>
                    </div>
                    <div className="showcase-slide__copy">
                      <span className="eyebrow">Signature Launch</span>
                      <h2>{product.name}</h2>
                      <p>{product.description}</p>
                      <div className="offer-grid">
                        <div>
                          <strong>{formatPrice(product.price)}</strong>
                          <span>Luxury pricing with boutique guidance</span>
                        </div>
                        <div>
                          <strong>Fast Enquiry</strong>
                          <span>Customers can email Muskan directly</span>
                        </div>
                      </div>
                      <div className="hero-actions">
                        <a className="button button--solid" href="#collections">
                          Shop Collection
                        </a>
                        <button className="button button--ghost" type="button" onClick={() => openEnquiry(product.id)}>
                          Ask About This Piece
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="carousel-controls">
                <button
                  type="button"
                  className="carousel-arrow"
                  onClick={() => setSlideIndex((current) => (current - 1 + currentSlides.length) % currentSlides.length)}
                  disabled={currentSlides.length < 2}
                >
                  ‹
                </button>
                <div className="carousel-dots">
                  {currentSlides.map((product, index) => (
                    <button
                      key={product.id || index}
                      type="button"
                      className={slideIndex === index ? "is-active" : ""}
                      onClick={() => setSlideIndex(index)}
                    >
                      <span>0{index + 1}</span>
                      <small>{product.category}</small>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="carousel-arrow"
                  onClick={() => setSlideIndex((current) => (current + 1) % currentSlides.length)}
                  disabled={currentSlides.length < 2}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rail-section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Shop By Style</span>
                <h2>Catalogue cards with a polished luxury feel.</h2>
              </div>
              <p>{settings.atelierNote}</p>
            </div>

            <div className="rail-track-wrap">
              <div className={`rail-track ${railProducts.length > 3 ? "is-animated" : ""}`}>
                {[...(railProducts.length > 3 ? [...railProducts, ...railProducts] : railProducts)].map((product, index) => (
                  <button className="rail-card" key={`${product.id}-${index}`} type="button" onClick={() => openEnquiry(product.id)}>
                    <ProductArt product={product} className="rail-card__image" />
                    <span>{product.category}</span>
                    <strong>{product.name}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="info-section">
          <div className="container info-grid">
            <article>
              <span className="eyebrow">Bridal Ready</span>
              <h3>Wedding looks and grand gifting pieces.</h3>
              <p>Premium gold, silver, and celebration-led jewellery arranged for a boutique shopping experience.</p>
            </article>
            <article>
              <span className="eyebrow">Searchable Frontend</span>
              <h3>Fast discovery with category and metal filters.</h3>
              <p>The navbar search and category tabs help customers find rings, sets, and edits quickly.</p>
            </article>
            <article>
              <span className="eyebrow">Direct Enquiry</span>
              <h3>Every piece can turn into a customer conversation.</h3>
              <p>Customers can ask price, styling, and availability questions directly from the landing page.</p>
            </article>
          </div>
        </section>

        <section className="collections-section" id="collections">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Collections</span>
                <h2>Featured pieces from Muskan&apos;s premium collection.</h2>
              </div>
              <p>
                {filteredProducts.length
                  ? `${filteredProducts.length} designs matching your selection.`
                  : "No exact match yet. Try another search or browse the full collection."}
              </p>
            </div>

            <div className="product-grid">
              {(filteredProducts.length ? filteredProducts : products).map((product) => (
                <article className="product-card" key={product.id}>
                  <ProductArt product={product} className="product-card__image" />
                  <div className="product-card__body">
                    <div className="product-card__meta">
                      <span>{product.category}</span>
                      {product.featured ? <mark>Featured</mark> : null}
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-card__footer">
                      <strong>{formatPrice(product.price)}</strong>
                      <button className="button button--ghost" type="button" onClick={() => openEnquiry(product.id)}>
                        Enquire
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="container story-grid">
            <div className="story-card story-card--highlight">
              <span className="eyebrow">Seller Story</span>
              <h2>Jewellery sold by {settings.sellerName}, styled with boutique warmth.</h2>
              <p>{settings.heroText}</p>
            </div>
            <div className="story-card">
              <strong>{settings.sellerName}</strong>
              <span>Curator behind the collection</span>
            </div>
            <div className="story-card">
              <strong>{settings.boutiqueLocation}</strong>
              <span>Boutique-led styling and support</span>
            </div>
            <div className="story-card">
              <strong>{settings.contactEmail}</strong>
              <span>Primary customer contact</span>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-panel">
            <div>
              <span className="eyebrow">Contact</span>
              <h2>Send a customer enquiry directly to Muskan Jewellery.</h2>
              <p>{settings.contactEmail}</p>
              <small>{settings.whatsappNumber}</small>
            </div>
            <button className="button button--solid" type="button" onClick={() => openEnquiry()}>
              Start Enquiry
            </button>
          </div>
        </section>
      </main>

      {modalOpen ? (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">Customer Enquiry</span>
                <h3>{selectedProduct ? `Ask about ${selectedProduct.name}` : "Book a jewellery consultation"}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>
                ×
              </button>
            </div>

            <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
              <input type="hidden" name="productId" value={selectedProductId} />
              <label>
                Customer name
                <input name="name" type="text" placeholder="Enter customer name" required />
              </label>
              <label>
                Customer email
                <input name="email" type="email" placeholder="Enter email" required />
              </label>
              <label>
                Phone number
                <input name="phone" type="text" placeholder="Optional phone number" />
              </label>
              <label>
                Message
                <textarea name="message" rows="4" placeholder="Ask about price, customisation, or delivery" required />
              </label>
              <button className="button button--solid" type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send Enquiry"}
              </button>
              <p className="form-feedback">{formMessage}</p>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
