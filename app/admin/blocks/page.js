"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { adminFetch, isUnauthorized } from "@/components/admin/adminApi";

const emptyForm = { villaId: "", startDate: "", endDate: "", reason: "" };

export default function AdminBlocksPage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState(
    /** @type {import('@/lib/booking/repository').InventoryBlockRow[] | null} */ (
      null
    ),
  );
  const [villas, setVillas] = useState(
    /** @type {{ id: string, name: string }[]} */ ([]),
  );
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const handleError = useCallback(
    (err) => {
      if (isUnauthorized(err)) router.replace("/admin");
      else setError(err instanceof Error ? err.message : "Request failed.");
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminFetch("/api/admin/blocks"), adminFetch("/api/villas")])
      .then(([blockData, villaData]) => {
        if (cancelled) return;
        setBlocks(blockData.blocks);
        setVillas(villaData.villas);
      })
      .catch((err) => {
        if (!cancelled) handleError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [handleError]);

  /** @param {string} key */
  const bind = (key) => ({
    value: form[key],
    onChange: (event) =>
      setForm((current) => ({ ...current, [key]: event.target.value })),
  });

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { block } = await adminFetch("/api/admin/blocks", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setBlocks((current) =>
        [...(current || []), block].sort((a, b) =>
          a.start_date.localeCompare(b.start_date),
        ),
      );
      setForm(emptyForm);
      setNotice("Block created.");
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminNav />
      <main className="admin-main">
        <h1>Inventory blocks</h1>

        <form
          className="admin-card admin-form admin-form--row"
          onSubmit={onSubmit}
        >
          <label>
            Villa
            <select name="villaId" required {...bind("villaId")}>
              <option value="">Select…</option>
              {villas.map((villa) => (
                <option key={villa.id} value={villa.id}>
                  {villa.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            From (night of)
            <input
              type="date"
              name="startDate"
              required
              {...bind("startDate")}
            />
          </label>
          <label>
            Until (check-out day)
            <input type="date" name="endDate" required {...bind("endDate")} />
          </label>
          <label>
            Reason
            <input
              type="text"
              name="reason"
              maxLength={200}
              placeholder="Maintenance, owner stay…"
              {...bind("reason")}
            />
          </label>
          <button type="submit" className="admin-btn" disabled={busy}>
            {busy ? "Saving…" : "Add block"}
          </button>
        </form>

        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? <output className="admin-ok">{notice}</output> : null}

        {!blocks && !error ? <p className="admin-muted">Loading…</p> : null}
        {blocks && blocks.length === 0 ? (
          <p className="admin-muted">No blocks.</p>
        ) : null}
        {blocks && blocks.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Villa</th>
                  <th>From</th>
                  <th>Until</th>
                  <th>Reason</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.id}>
                    <td>{block.villa_id}</td>
                    <td>{block.start_date}</td>
                    <td>{block.end_date}</td>
                    <td className="wrap">{block.reason || "—"}</td>
                    <td>{block.created_at.slice(0, 16).replace("T", " ")}</td>
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
