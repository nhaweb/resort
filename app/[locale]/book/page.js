import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookingForm from "@/components/booking/BookingForm";
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
    title: dictionary.booking.metaTitle,
    description: dictionary.booking.metaDescription,
  };
}

async function BookingFormSlot({ searchParams }) {
  const query = await searchParams;
  const initialVillaId = typeof query.villa === "string" ? query.villa : null;
  const cancelled = query.cancelled === "1";

  return <BookingForm initialVillaId={initialVillaId} cancelled={cancelled} />;
}

export default async function BookPage({ params, searchParams }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Link className="sr-only" href="#book">
        {dictionary.ui.skipToContent}
      </Link>
      <SiteNav variant="page" />
      <main id="book" className="booking">
        <div className="booking__hero">
          <p className="booking__eyebrow">{dictionary.site.name}</p>
          <h1 className="booking__title">{dictionary.booking.title}</h1>
          <p className="booking__lead">{dictionary.booking.lead}</p>
        </div>
        <Suspense
          fallback={
            <div className="booking__panel">
              <p>{dictionary.booking.loadingVillas}</p>
            </div>
          }
        >
          <BookingFormSlot searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </LocaleProvider>
  );
}
