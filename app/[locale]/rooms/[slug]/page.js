import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import RoomDetail from "@/components/rooms/RoomDetail";
import SiteNav from "@/components/SiteNav";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { getRoomIds, mergeRoomWithInventory } from "@/lib/rooms";
import { loadInventoryVillas } from "@/lib/rooms-inventory";
import { getMarketingVilla } from "@/lib/sanity/fetch";

export function generateStaticParams() {
  return getRoomIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const room = await getMarketingVilla(locale, slug);
  if (!room) return {};
  return {
    title: `${room.name} · ${getDictionary(locale).site.name}`,
    description: room.description,
  };
}

async function RoomDetailWithRates({ locale, room, copy, siteName }) {
  await connection();
  const inventory = await loadInventoryVillas();
  return (
    <RoomDetail
      locale={locale}
      room={mergeRoomWithInventory(
        room,
        inventory.find((item) => item.id === room.id),
      )}
      copy={copy}
      siteName={siteName}
    />
  );
}

async function RoomPageBody({ params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const room = await getMarketingVilla(locale, slug);
  if (!room) notFound();

  const dictionary = getDictionary(locale);
  const copy = dictionary.rooms;
  const siteName = dictionary.site.name;

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Link className="sr-only" href="#room">
        {dictionary.ui.skipToContent}
      </Link>
      <SiteNav variant="page" />
      <main id="room">
        <Suspense
          fallback={
            <RoomDetail
              locale={locale}
              room={mergeRoomWithInventory(room, null)}
              copy={copy}
              siteName={siteName}
            />
          }
        >
          <RoomDetailWithRates
            locale={locale}
            room={room}
            copy={copy}
            siteName={siteName}
          />
        </Suspense>
      </main>
      <Footer />
    </LocaleProvider>
  );
}

export default function RoomPage({ params }) {
  return (
    <Suspense fallback={null}>
      <RoomPageBody params={params} />
    </Suspense>
  );
}
