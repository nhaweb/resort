import { sendBookingConfirmation } from "@/lib/email";
import { getVilla } from "./repository";

/**
 * Sends the booking confirmation for a paid reservation.
 * Never throws: a mail failure must not fail payment handling.
 *
 * @param {import('./repository').ReservationRow | null} reservation
 */
export async function notifyReservationPaid(reservation) {
  if (!reservation) return;
  try {
    const villa = await getVilla(reservation.villa_id);
    const result = await sendBookingConfirmation(reservation, villa);
    if (!result.ok) {
      console.error(
        `[booking] confirmation email failed for ${reservation.id}:`,
        result.error,
      );
    }
  } catch (error) {
    console.error(
      `[booking] confirmation email crashed for ${reservation.id}:`,
      error,
    );
  }
}
