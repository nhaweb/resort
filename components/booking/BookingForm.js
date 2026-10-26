"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import EnquiryForm from "@/components/booking/EnquiryForm";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   nightlyRateCents: number,
 *   maxGuests: number,
 *   currency: string
 * }} VillaOption
 */

/**
 * @param {{ initialVillaId?: string | null, cancelled?: boolean }} props
 */
export default function BookingForm({
  initialVillaId = null,
  cancelled = false,
}) {
  const locale = useLocale();
  const { booking, site, rooms, villas: villaCopy } = useDictionary();
  const [villas, setVillas] = useState(/** @type {VillaOption[]} */ ([]));
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState(
    /** @type {'idle' | 'checking' | 'holding' | 'redirecting'} */ ("idle"),
  );
  const [availability, setAvailability] = useState(
    /** @type {null | { available: boolean, amountCents: number | null, nights: number }} */ (
      null
    ),
  );
  const [isPending, startTransition] = useTransition();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [villaId, setVillaId] = useState(initialVillaId || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    let cancelledFetch = false;
    (async () => {
      try {
        const res = await fetch("/api/villas");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || booking.errors.loadVillas);
        if (cancelledFetch) return;
        const list = data.villas || [];
        setVillas(list);
        // Drop unknown ids from a stale ?villa= link; never auto-pick one.
        setVillaId((current) =>
          list.some((v) => v.id === current) ? current : "",
        );
      } catch (error) {
        if (!cancelledFetch) {
          setLoadError(
            error instanceof Error ? error.message : booking.errors.loadVillas,
          );
        }
      }
    })();
    return () => {
      cancelledFetch = true;
    };
  }, [booking.errors.loadVillas]);

  const selectedVilla = villas.find((v) => v.id === villaId) || null;
  const marketing = villaCopy.find((v) => v.id === villaId);

  useEffect(() => {
    if (!villaId || !checkIn || !checkOut) {
      setAvailability(null);
      return;
    }

    const controller = new AbortController();
    setStatus("checking");
    setFormError("");

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          villaId,
          checkIn,
          checkOut,
          locale,
        });
        const res = await fetch(`/api/availability?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || booking.errors.availability);
        setAvailability({
          available: data.available,
          amountCents: data.amountCents,
          nights: data.nights,
        });
        setStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        setAvailability(null);
        setFormError(
          error instanceof Error ? error.message : booking.errors.availability,
        );
        setStatus("idle");
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [villaId, checkIn, checkOut, locale, booking.errors.availability]);

  function formatMoney(cents, currency) {
    try {
      return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-GB", {
        style: "currency",
        currency: (currency || "eur").toUpperCase(),
      }).format(cents / 100);
    } catch {
      return `${(cents / 100).toFixed(0)} ${(currency || "eur").toUpperCase()}`;
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!selectedVilla) {
      setFormError(booking.errors.pickVilla);
      return;
    }
    if (!availability?.available || !availability.amountCents) {
      setFormError(booking.errors.unavailable);
      return;
    }
    if (guests > selectedVilla.maxGuests) {
      setFormError(
        booking.errors.tooManyGuests.replace(
          "{max}",
          String(selectedVilla.maxGuests),
        ),
      );
      return;
    }
    if (!acceptedTerms) {
      setFormError(booking.errors.acceptTerms);
      return;
    }

    startTransition(async () => {
      try {
        setStatus("holding");
        const createRes = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            villaId,
            checkIn,
            checkOut,
            guests,
            guestName,
            guestEmail,
            guestPhone: guestPhone || undefined,
            locale,
          }),
        });
        const created = await createRes.json();
        if (!createRes.ok) {
          throw new Error(created.error || booking.errors.create);
        }

        setStatus("redirecting");
        const payRes = await fetch(
          `/api/reservations/${created.reservation.id}/checkout`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale }),
          },
        );
        const pay = await payRes.json();
        if (!payRes.ok) {
          throw new Error(pay.error || booking.errors.pay);
        }
        if (!pay.url) {
          throw new Error(booking.errors.pay);
        }
        window.location.href = pay.url;
      } catch (error) {
        setStatus("idle");
        setFormError(
          error instanceof Error ? error.message : booking.errors.create,
        );
      }
    });
  }

  const busy = isPending || status === "holding" || status === "redirecting";

  if (loadError) {
    return (
      <div className="booking__panel" role="alert">
        <p className="booking__error">{loadError}</p>
        <p className="booking__hint">{booking.errors.dbHint}</p>
        <Link className="btn" href={`/${locale}`}>
          {booking.backHome}
        </Link>
      </div>
    );
  }

  const roomsHref = `/${locale}/rooms`;
  const soldOut =
    availability?.available === false && villaId && checkIn && checkOut;

  return (
    <>
      <form className="booking__form" onSubmit={onSubmit} noValidate>
        {cancelled ? (
          <output className="booking__notice">{booking.cancelledNotice}</output>
        ) : null}

        {marketing ? (
          <section className="booking-room" aria-labelledby="booking-room-name">
            <div className="booking-room__media">
              <Image
                src={marketing.image}
                alt={marketing.alt}
                fill
                sizes="(min-width: 720px) 220px, 100vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="booking-room__body">
              <p className="booking-room__label">{booking.selectedVilla}</p>
              <h2 id="booking-room-name" className="booking-room__name">
                {marketing.name}
              </h2>
              <p className="booking-room__line">{marketing.line}</p>
              {selectedVilla ? (
                <p className="booking-room__meta">
                  {formatMoney(
                    selectedVilla.nightlyRateCents,
                    selectedVilla.currency,
                  )}{" "}
                  / {booking.night} ·{" "}
                  {booking.maxGuests.replace(
                    "{max}",
                    String(selectedVilla.maxGuests),
                  )}
                </p>
              ) : null}
              <div className="booking-room__links">
                <Link
                  className="link-plain"
                  href={`${roomsHref}/${marketing.id}`}
                >
                  {rooms.viewVilla}
                </Link>
                <Link className="link-plain" href={roomsHref}>
                  {rooms.browseRooms}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="booking-pick">
            <p>{rooms.chooseVillaFirst}</p>
            <Link className="btn" href={roomsHref}>
              {rooms.browseRooms}
            </Link>
          </div>
        )}

        <div className="booking__grid">
          <label className="booking__field booking__field--wide">
            <span>{marketing ? rooms.changeVilla : booking.fields.villa}</span>
            <select
              name="villaId"
              value={villaId}
              onChange={(e) => setVillaId(e.target.value)}
              required
              disabled={busy || villas.length === 0}
            >
              {villas.length === 0 ? (
                marketing ? (
                  <option value={villaId}>{marketing.name}</option>
                ) : (
                  <option value="">{booking.loadingVillas}</option>
                )
              ) : (
                <>
                  {villaId ? null : (
                    <option value="">{booking.selectPlaceholder}</option>
                  )}
                  {villas.map((villa) => (
                    <option key={villa.id} value={villa.id}>
                      {villa.name} ·{" "}
                      {formatMoney(villa.nightlyRateCents, villa.currency)}/
                      {booking.night}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>

          <label className="booking__field">
            <span>{booking.fields.checkIn}</span>
            <input
              type="date"
              name="checkIn"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              disabled={busy}
            />
          </label>

          <label className="booking__field">
            <span>{booking.fields.checkOut}</span>
            <input
              type="date"
              name="checkOut"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              disabled={busy}
            />
          </label>

          <label className="booking__field">
            <span>{booking.fields.guests}</span>
            <input
              type="number"
              name="guests"
              min={1}
              max={selectedVilla?.maxGuests || 8}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
              disabled={busy}
            />
            <span className="booking__meta">
              {selectedVilla
                ? booking.maxGuests.replace(
                    "{max}",
                    String(selectedVilla.maxGuests),
                  )
                : "\u00a0"}
            </span>
          </label>

          {/* Spacer keeps guests on its own row so name/email stay paired */}
          <div
            className="booking__field booking__field--spacer"
            aria-hidden="true"
          />

          <label className="booking__field">
            <span>{booking.fields.name}</span>
            <input
              type="text"
              name="guestName"
              autoComplete="name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              disabled={busy}
            />
          </label>

          <label className="booking__field">
            <span>{booking.fields.email}</span>
            <input
              type="email"
              name="guestEmail"
              autoComplete="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              disabled={busy}
            />
          </label>

          <label className="booking__field booking__field--wide">
            <span>{booking.fields.phone}</span>
            <input
              type="tel"
              name="guestPhone"
              autoComplete="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              disabled={busy}
            />
          </label>
        </div>

        <div className="booking__summary" aria-live="polite">
          <h2 className="booking__summary-title">{booking.summaryTitle}</h2>
          {status === "checking" ? (
            <p>{booking.checking}</p>
          ) : availability ? (
            availability.available ? (
              <>
                <p>
                  {booking.nightsLabel.replace(
                    "{n}",
                    String(availability.nights),
                  )}
                </p>
                <p className="booking__price">
                  {formatMoney(
                    availability.amountCents || 0,
                    selectedVilla?.currency || "eur",
                  )}
                </p>
                <p className="booking__meta">{booking.fullStayNote}</p>
              </>
            ) : (
              <p className="booking__error">{booking.errors.unavailable}</p>
            )
          ) : (
            <p className="booking__meta">{booking.summaryHint}</p>
          )}
          <p className="booking__meta">{booking.minStayNote}</p>
          <p className="booking__meta">
            {booking.holdNote.replace("{minutes}", "15")}
          </p>
          <p className="booking__meta">
            {site.email} · {site.phone}
          </p>
        </div>

        {formError ? (
          <p className="booking__error" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="booking__terms">
          <input
            id="booking-terms"
            type="checkbox"
            name="acceptTerms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={busy}
          />
          <label htmlFor="booking-terms">{booking.termsLead}</label>
          <Link className="link-plain" href={`/${locale}/policies`}>
            {booking.termsLink}
          </Link>
        </div>

        <div className="booking__actions">
          <button
            className="btn"
            type="submit"
            disabled={
              busy ||
              !acceptedTerms ||
              !availability?.available ||
              villas.length === 0 ||
              status === "checking"
            }
          >
            {status === "redirecting"
              ? booking.redirecting
              : status === "holding"
                ? booking.holding
                : booking.payCta}
          </button>
          <Link className="link-plain" href={`/${locale}#stay`}>
            {booking.backHome}
          </Link>
        </div>
      </form>
      {soldOut ? (
        <EnquiryForm
          key={`${villaId}|${checkIn}|${checkOut}`}
          villaId={villaId}
          checkIn={checkIn}
          checkOut={checkOut}
          initialName={guestName}
          initialEmail={guestEmail}
        />
      ) : null}
    </>
  );
}
