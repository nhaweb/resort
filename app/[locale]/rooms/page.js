import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import RoomList from "@/components/rooms/RoomList";
import SiteNav from "@/components/SiteNav";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { mergeRoomWithInventory } from "@/lib/rooms";
import { loadInventoryVillas } from "@/lib/rooms-inventory";
import { getMarketingVillas } from "@/lib/sanity/fetch";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { rooms } = getDictionary(locale);
  return {
    title: rooms.metaTitle,
    description: rooms.metaDescription,
  };
}

async function RoomListWithRates({ locale, copy }) {
  await connection();
  const [marketing, inventory] = await Promise.all([
    getMarketingVillas(locale),
    loadInventoryVillas(),
  ]);
  const rooms = marketing.map((villa) =>
    mergeRoomWithInventory(
      villa,
      inventory.find((item) => item.id === villa.id),
    ),
  );
  return <RoomList locale={locale} rooms={rooms} copy={copy} />;
}

async function RoomsPageBody({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);
  const copy = dictionary.rooms;
  const marketing = await getMarketingVillas(locale);
  const catalogOnly = marketing.map((villa) =>
    mergeRoomWithInventory(villa, null),
  );

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Link className="sr-only" href="#rooms">
        {dictionary.ui.skipToContent}
      </Link>
      <SiteNav variant="page" />
      <main id="rooms" className="rooms">
        <header className="rooms__head">
          <p className="rooms__eyebrow">{dictionary.site.name}</p>
          <h1 className="rooms__title">{copy.title}</h1>
          <p className="rooms__lead">{copy.lead}</p>
        </header>
        <Suspense
          fallback={
            <RoomList locale={locale} rooms={catalogOnly} copy={copy} />
          }
        >
          <RoomListWithRates locale={locale} copy={copy} />
        </Suspense>
      </main>
      <Footer />
    </LocaleProvider>
  );
}

export default function RoomsPage({ params }) {
  return (
    <Suspense fallback={null}>
      <RoomsPageBody params={params} />
    </Suspense>
  );
}
