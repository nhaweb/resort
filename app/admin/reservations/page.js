"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { adminFetch, isUnauthorized } from "@/components/admin/adminApi";
import { formatMoney } from "@/lib/format";

export default function AdminReservationsPage() {
  const router = useRouter();
  const [rows, setRows] = useState(
    /** @type {import('@/lib/booking/repository').ReservationRow[] | null} */ (
      null
    ),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminFetch("/api/admin/reservations?limit=200")
      .then((data) => {
        if (!cancelled) setRows(data.reservations);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) router.replace("/admin");
        else setError(err instanceof Error ? err.message : "Failed to load.");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      <AdminNav />
      <main className="admin-main">
        <h1>Reservations</h1>
        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}
        {!rows && !error ? <p className="admin-muted">Loading…</p> : null}
        {rows && rows.length === 0 ? (
          <p className="admin-muted">No reservations yet.</p>
        ) : null}
        {rows && rows.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Villa</th>
                  <th>Stay</th>
                  <th>Guests</th>
                  <th>Guest</th>
                  <th>Total</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.created_at.slice(0, 16).replace("T", " ")}</td>
                    <td>
                      <span
                        className={`admin-status admin-status--${row.status}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>{row.villa_id}</td>
                    <td>
                      {row.check_in} → {row.check_out} ({row.nights}n)
                    </td>
                    <td>{row.guests}</td>
                    <td>
                      {row.guest_name}
                      <br />
                      <span className="admin-muted">{row.guest_email}</span>
                    </td>
                    <td>{formatMoney(row.amount_cents, row.currency)}</td>
                    <td>
                      <code>{row.id}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </>
  );
}
