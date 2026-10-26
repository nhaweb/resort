import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { LocaleProvider } from "@/components/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { getMarketingGallery } from "@/lib/sanity/fetch";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { gallery } = getDictionary(locale);
  return {
    title: gallery.metaTitle,
    description: gallery.metaDescription,
  };
}

export default async function GalleryPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const base = getDictionary(locale);
  const gallery = await getMarketingGallery(locale);
  const dictionary = { ...base, gallery };

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Link className="sr-only" href="#gallery">
        {dictionary.ui.skipToContent}
      </Link>
      <SiteNav variant="page" />
      <main id="gallery" className="rooms gallery-page">
        <header className="rooms__head">
          <p className="rooms__eyebrow">{dictionary.site.name}</p>
          <h1 className="rooms__title">{gallery.title}</h1>
          <p className="rooms__lead">{gallery.description}</p>
        </header>
        <Gallery showIntro={false} />
      </main>
      <Footer />
    </LocaleProvider>
  );
}
