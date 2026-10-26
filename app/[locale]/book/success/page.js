import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookingSuccess from "@/components/booking/BookingSuccess";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = getDictionary(locale);
  return {
    title: dictionary.booking.success.metaTitle,
    description: dictionary.booking.metaDescription,
  };
}

async function SuccessSlot({ searchParams }) {
  const query = await searchParams;
  const reservationId =
    typeof query.reservation === "string" ? query.reservation : null;
  const mock = query.mock === "1";

  return <BookingSuccess reservationId={reservationId} mock={mock} />;
}

export default async function BookSuccessPage({ params, searchParams }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <SiteNav variant="page" />
      <main className="booking booking--success">
        <Suspense
          fallback={
            <div className="booking__panel">
              <p>{dictionary.booking.success.loading}</p>
            </div>
          }
        >
          <SuccessSlot searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </LocaleProvider>
  );
}
