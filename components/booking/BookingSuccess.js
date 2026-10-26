"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";

/**
 * @param {{ reservationId: string | null, mock?: boolean }} props
 */
export default function BookingSuccess({ reservationId, mock = false }) {
  const locale = useLocale();
  const { booking } = useDictionary();
  const [state, setState] = useState(
    /** @type {'loading' | 'ready' | 'error'} */ ("loading"),
  );
  const [reservation, setReservation] = useState(
    /** @type {null | Record<string, unknown>} */ (null),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reservationId) {
      setState("error");
      setError(booking.errors.missingReservation);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/reservations/${reservationId}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || booking.errors.loadReservation);
        if (cancelled) return;
        setReservation(data.reservation);
        setState("ready");
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : booking.errors.loadReservation,
        );
        setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    reservationId,
    booking.errors.loadReservation,
    booking.errors.missingReservation,
  ]);

  function formatMoney(cents, currency) {
    try {
      return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-GB", {
        style: "currency",
        currency: String(currency || "eur").toUpperCase(),
      }).format(Number(cents) / 100);
    } catch {
      return `${(Number(cents) / 100).toFixed(0)} ${String(currency || "eur").toUpperCase()}`;
    }
  }

  if (state === "loading") {
    return (
      <div className="booking__panel">
        <p>{booking.success.loading}</p>
      </div>
    );
  }

  if (state === "error" || !reservation) {
    return (
      <div className="booking__panel" role="alert">
        <p className="booking__error">
          {error || booking.errors.loadReservation}
        </p>
        <Link className="btn" href={`/${locale}/book`}>
          {booking.tryAgain}
        </Link>
      </div>
    );
  }

  const paid = reservation.status === "paid";

  return (
    <div className="booking__panel">
      <p className="booking__eyebrow">
        {paid ? booking.success.paidEyebrow : booking.success.pendingEyebrow}
      </p>
      <h1 className="booking__title">
        {paid ? booking.success.paidTitle : booking.success.pendingTitle}
      </h1>
      <p className="booking__lead">
        {paid ? booking.success.paidBody : booking.success.pendingBody}
      </p>
      {mock ? (
        <p className="booking__notice">{booking.success.mockNote}</p>
      ) : null}

      <dl className="booking__dl">
        <div>
          <dt>{booking.fields.villa}</dt>
          <dd>{String(reservation.villaName)}</dd>
        </div>
        <div>
          <dt>{booking.fields.checkIn}</dt>
          <dd>{String(reservation.checkIn)}</dd>
        </div>
        <div>
          <dt>{booking.fields.checkOut}</dt>
          <dd>{String(reservation.checkOut)}</dd>
        </div>
        <div>
          <dt>{booking.fields.guests}</dt>
          <dd>{String(reservation.guests)}</dd>
        </div>
        <div>
          <dt>{booking.summaryTitle}</dt>
          <dd>{formatMoney(reservation.amountCents, reservation.currency)}</dd>
        </div>
        <div>
          <dt>{booking.success.reference}</dt>
          <dd>
            <code>{String(reservation.id)}</code>
          </dd>
        </div>
      </dl>

      <div className="booking__actions">
        <Link className="btn" href={`/${locale}`}>
          {booking.backHome}
        </Link>
        {!paid ? (
          <Link className="link-plain" href={`/${locale}/book`}>
            {booking.tryAgain}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
