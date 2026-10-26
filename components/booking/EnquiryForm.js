"use client";

import { useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

/**
 * Sold-out fallback: lets a guest leave a note for the dates they wanted.
 * @param {{
 *   villaId: string,
 *   checkIn: string,
 *   checkOut: string,
 *   initialName?: string,
 *   initialEmail?: string
 * }} props
 */
export default function EnquiryForm({
  villaId,
  checkIn,
  checkOut,
  initialName = "",
  initialEmail = "",
}) {
  const locale = useLocale();
  const { rooms } = useDictionary();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(
    /** @type {'idle' | 'sending' | 'success' | 'error'} */ ("idle"),
  );
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: name,
          guestEmail: email,
          message,
          villaId,
          checkIn,
          checkOut,
          locale,
          website: "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || rooms.enquiryError);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : rooms.enquiryError);
    }
  }

  const sending = status === "sending";

  return (
    <section className="enquiry" aria-labelledby="enquiry-title">
      <h2 id="enquiry-title" className="enquiry__title">
        {rooms.soldOutTitle}
      </h2>
      <p className="enquiry__body">{rooms.soldOutBody}</p>

      {status === "success" ? (
        <output className="booking__notice">{rooms.enquirySuccess}</output>
      ) : (
        <form className="enquiry__form" onSubmit={onSubmit}>
          <label className="booking__field">
            <span>{rooms.enquiryName}</span>
            <input
              type="text"
              name="enquiryName"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={sending}
            />
          </label>
          <label className="booking__field">
            <span>{rooms.enquiryEmail}</span>
            <input
              type="email"
              name="enquiryEmail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={sending}
            />
          </label>
          <label className="booking__field enquiry__message">
            <span>{rooms.enquiryMessage}</span>
            <textarea
              name="enquiryMessage"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={sending}
            />
            {/* Honeypot — leave empty */}
            <input
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              name="website"
              defaultValue=""
              aria-hidden="true"
            />
          </label>
          {status === "error" ? (
            <p className="booking__error enquiry__error" role="alert">
              {error || rooms.enquiryError}
            </p>
          ) : null}
          <div className="enquiry__actions">
            <button className="btn" type="submit" disabled={sending}>
              {sending ? rooms.enquirySending : rooms.enquirySubmit}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
