"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { adminFetch, isUnauthorized } from "@/components/admin/adminApi";

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [rows, setRows] = useState(
    /** @type {import('@/lib/booking/repository').EnquiryRow[] | null} */ (
      null
    ),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminFetch("/api/admin/enquiries")
      .then((data) => {
        if (!cancelled) setRows(data.enquiries);
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
        <h1>Enquiries</h1>
        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}
        {!rows && !error ? <p className="admin-muted">Loading…</p> : null}
        {rows && rows.length === 0 ? (
          <p className="admin-muted">No enquiries yet.</p>
        ) : null}
        {rows && rows.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Guest</th>
                  <th>Villa</th>
                  <th>Dates</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.created_at.slice(0, 16).replace("T", " ")}</td>
                    <td>
                      {row.guest_name}
                      <br />
                      <a href={`mailto:${row.guest_email}`}>
                        {row.guest_email}
                      </a>
                    </td>
                    <td>{row.villa_id || "any"}</td>
                    <td>
                      {row.check_in && row.check_out
                        ? `${row.check_in} → ${row.check_out}`
                        : "—"}
                    </td>
                    <td className="wrap">{row.message}</td>
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
