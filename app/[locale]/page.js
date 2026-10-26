import Link from "next/link";
import { notFound } from "next/navigation";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Cta from "@/components/Cta";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import { LocaleProvider } from "@/components/LocaleProvider";
import PageLoader from "@/components/PageLoader";
import Providers from "@/components/Providers";
import Rhythm from "@/components/Rhythm";
import Showcase from "@/components/Showcase";
import SiteNav from "@/components/SiteNav";
import TidePicker from "@/components/TidePicker";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import {
  getMarketingFaq,
  getMarketingGallery,
  getMarketingVillas,
} from "@/lib/sanity/fetch";

export default async function Home({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const base = getDictionary(locale);
  const [villas, faq, gallery] = await Promise.all([
    getMarketingVillas(locale),
    getMarketingFaq(locale),
    getMarketingGallery(locale),
  ]);
  const dictionary = { ...base, villas, faq, gallery };

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <PageLoader />
      <Providers>
        <Link className="sr-only" href="#top">
          {dictionary.ui.skipToContent}
        </Link>
        <SiteNav />
        <main>
          <Hero />
          <Intro />
          <Showcase />
          <Rhythm />
          <Gallery />
          <About />
          <TidePicker />
          <Faq />
          <Contact />
          <Cta />
        </main>
        <Footer />
      </Providers>
    </LocaleProvider>
  );
}
