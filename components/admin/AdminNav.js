"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch } from "./adminApi";

const links = [
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/blocks", label: "Inventory blocks" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminNav() {
  const router = useRouter();

  async function logout() {
    await adminFetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    router.replace("/admin");
  }

  return (
    <header className="admin-nav">
      <Link className="admin-nav__brand" href="/admin">
        PML Privilege Resort admin
      </Link>
      <nav aria-label="Admin">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <button type="button" className="admin-btn" onClick={logout}>
        Sign out
      </button>
    </header>
  );
}
