"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAuth({ email, hasPassword }) {
  const router = useRouter();
  const [mode, setMode] = useState(hasPassword ? "login" : "setup");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage(mode === "setup" ? "Creating admin access..." : "Opening dashboard...");

    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      const response = await fetch(mode === "setup" ? "/api/admin/setup" : "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-layout container">
        <div className="auth-copy">
          <span className="eyebrow">Protected Admin Access</span>
          <h1>Only the configured Muskan Jewellery admin can manage this store.</h1>
          <p>
            Use the fixed admin email <strong>{email}</strong> to set your password once, then log in to manage products,
            enquiries, and Gmail delivery settings.
          </p>
          <a className="button button--ghost" href="/">
            Back To Storefront
          </a>
        </div>

        <div className="auth-panel">
          <div className="auth-panel__head">
            <span className="eyebrow">Admin Email</span>
            <h2>{email}</h2>
          </div>

          <div className="auth-toggle">
            <button type="button" className={mode === "setup" ? "is-active" : ""} onClick={() => setMode("setup")}>
              Set Password
            </button>
            <button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Admin email
              <input name="email" type="email" value={email} readOnly />
            </label>
            <label>
              {mode === "setup" ? "Create password" : "Password"}
              <input
                name="password"
                type="password"
                placeholder={mode === "setup" ? "Create a strong password" : "Enter your password"}
                required
              />
            </label>
            <button className="button button--solid" type="submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "setup" ? "Save Admin Password" : "Open Admin Panel"}
            </button>
            <p className="form-feedback">{message}</p>
          </form>
        </div>
      </section>
    </main>
  );
}
