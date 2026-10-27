"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/components/admin/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ secret }),
      });
      router.push("/admin/reservations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-main">
      <h1>PML Privilege Resort admin</h1>
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        <label>
          Admin secret
          <input
            type="password"
            name="secret"
            autoComplete="current-password"
            required
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
          />
        </label>
        <button type="submit" className="admin-btn" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </main>
  );
}
