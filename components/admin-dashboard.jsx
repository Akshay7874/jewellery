"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function formatPrice(value) {
  return currencyFormatter.format(value || 0);
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export default function AdminDashboard({ sessionEmail, settings, products, enquiries }) {
  const router = useRouter();
  const [settingsMessage, setSettingsMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [busyAction, setBusyAction] = useState("");

  async function handleSettingsSubmit(event) {
    event.preventDefault();
    setBusyAction("settings");
    setSettingsMessage("Saving settings...");

    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save settings.");
      }

      setSettingsMessage("Settings saved successfully.");
      router.refresh();
    } catch (error) {
      setSettingsMessage(error.message);
    } finally {
      setBusyAction("");
    }
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    setBusyAction("product");
    setProductMessage("Uploading jewellery...");

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("featured", String(formData.get("featured") === "on"));

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to upload product.");
      }

      setProductMessage("Jewellery uploaded successfully.");
      event.currentTarget.reset();
      router.refresh();
    } catch (error) {
      setProductMessage(error.message);
    } finally {
      setBusyAction("");
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setBusyAction("password");
    setPasswordMessage("Updating password...");

    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      const response = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update password.");
      }

      event.currentTarget.reset();
      setPasswordMessage("Admin password updated.");
    } catch (error) {
      setPasswordMessage(error.message);
    } finally {
      setBusyAction("");
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm("Delete this jewellery item?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }

      router.refresh();
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="admin-shell">
      <section className="admin-hero container">
        <div>
          <span className="eyebrow">Private Dashboard</span>
          <h1>Manage the full Muskan Jewellery storefront from one premium admin panel.</h1>
          <p>Signed in as {sessionEmail}</p>
        </div>
        <div className="admin-hero__actions">
          <a className="button button--ghost" href="/">
            View Storefront
          </a>
          <button className="button button--solid" type="button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </section>

      <section className="admin-grid container">
        <article className="admin-card admin-card--wide">
          <div className="section-head section-head--compact">
            <div>
              <span className="eyebrow">Store Settings</span>
              <h2>Update homepage text and Gmail delivery details.</h2>
            </div>
          </div>

          <form className="admin-form admin-form--two-column" onSubmit={handleSettingsSubmit}>
            <label>
              Brand name
              <input name="brandName" defaultValue={settings.brandName} required />
            </label>
            <label>
              Seller name
              <input name="sellerName" defaultValue={settings.sellerName} required />
            </label>
            <label>
              Hero title
              <input name="heroTitle" defaultValue={settings.heroTitle} required />
            </label>
            <label>
              Boutique location
              <input name="boutiqueLocation" defaultValue={settings.boutiqueLocation} required />
            </label>
            <label className="admin-form__full">
              Hero text
              <textarea name="heroText" rows="4" defaultValue={settings.heroText} required />
            </label>
            <label>
              Accent note
              <input name="accentNote" defaultValue={settings.accentNote} required />
            </label>
            <label>
              Metals note
              <input name="metalsNote" defaultValue={settings.metalsNote} required />
            </label>
            <label className="admin-form__full">
              Atelier note
              <textarea name="atelierNote" rows="4" defaultValue={settings.atelierNote} required />
            </label>
            <label>
              Contact email
              <input name="contactEmail" type="email" defaultValue={settings.contactEmail} required />
            </label>
            <label>
              Gmail sender
              <input name="gmailUser" type="email" value={settings.gmailUser} readOnly />
            </label>
            <label>
              Gmail app password
              <input name="gmailAppPassword" type="password" placeholder="Enter a new Gmail app password if needed" />
            </label>
            <label>
              WhatsApp number
              <input name="whatsappNumber" defaultValue={settings.whatsappNumber} />
            </label>
            <button className="button button--solid admin-form__submit" type="submit" disabled={busyAction === "settings"}>
              {busyAction === "settings" ? "Saving..." : "Save Storefront Settings"}
            </button>
            <p className="form-feedback admin-form__full">{settingsMessage}</p>
          </form>
        </article>

        <article className="admin-card">
          <div className="section-head section-head--compact">
            <div>
              <span className="eyebrow">Upload Product</span>
              <h2>Add jewellery image, details, and price.</h2>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleProductSubmit}>
            <label>
              Product name
              <input name="name" required />
            </label>
            <label>
              Category
              <input name="category" placeholder="Bridal Gold, Silver Edit, Rings" required />
            </label>
            <label>
              Description
              <textarea name="description" rows="4" required />
            </label>
            <label>
              Price
              <input name="price" type="number" min="1" step="0.01" required />
            </label>
            <label className="checkbox-field">
              <input name="featured" type="checkbox" />
              Mark as featured
            </label>
            <label>
              Product image
              <input name="image" type="file" accept="image/*" />
            </label>
            <button className="button button--solid" type="submit" disabled={busyAction === "product"}>
              {busyAction === "product" ? "Uploading..." : "Upload Jewellery"}
            </button>
            <p className="form-feedback">{productMessage}</p>
          </form>
        </article>

        <article className="admin-card">
          <div className="section-head section-head--compact">
            <div>
              <span className="eyebrow">Security</span>
              <h2>Change the admin password.</h2>
            </div>
          </div>

          <form className="admin-form" onSubmit={handlePasswordSubmit}>
            <label>
              Current password
              <input name="currentPassword" type="password" required />
            </label>
            <label>
              New password
              <input name="nextPassword" type="password" required />
            </label>
            <button className="button button--solid" type="submit" disabled={busyAction === "password"}>
              {busyAction === "password" ? "Updating..." : "Update Password"}
            </button>
            <p className="form-feedback">{passwordMessage}</p>
          </form>
        </article>
      </section>

      <section className="container admin-lists">
        <article className="admin-card admin-card--wide">
          <div className="section-head section-head--compact">
            <div>
              <span className="eyebrow">Products</span>
              <h2>Current catalogue visible on the storefront.</h2>
            </div>
          </div>
          <div className="admin-products">
            {products.map((product) => (
              <article className="admin-product-card" key={product.id}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="admin-product-card__image" />
                ) : (
                  <div className="admin-product-card__image admin-product-card__image--placeholder">{product.name.slice(0, 2).toUpperCase()}</div>
                )}
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatPrice(product.price)}</strong>
                <button className="button button--ghost" type="button" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        </article>

        <article className="admin-card admin-card--wide">
          <div className="section-head section-head--compact">
            <div>
              <span className="eyebrow">Customer Enquiries</span>
              <h2>Recent messages submitted by customers.</h2>
            </div>
          </div>
          <div className="admin-enquiries">
            {enquiries.length ? (
              enquiries.map((enquiry) => (
                <article className="admin-enquiry-card" key={enquiry.id}>
                  <div className="admin-enquiry-card__head">
                    <h3>{enquiry.name}</h3>
                    <span>{formatDate(enquiry.createdAt)}</span>
                  </div>
                  <p><strong>Product:</strong> {enquiry.productName}</p>
                  <p><strong>Email:</strong> {enquiry.email}</p>
                  <p><strong>Phone:</strong> {enquiry.phone || "Not provided"}</p>
                  <p>{enquiry.message}</p>
                </article>
              ))
            ) : (
              <div className="empty-state">Customer enquiries will appear here after visitors submit them.</div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
