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
import Providers from "@/components/Providers";
import Rhythm from "@/components/Rhythm";
import Showcase from "@/components/Showcase";
import SiteNav from "@/components/SiteNav";
import TidePicker from "@/components/TidePicker";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

export default async function Home({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Providers>
        <a className="sr-only" href="#top">
          {dictionary.ui.skipToContent}
        </a>
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
          <Cta />
          <Contact />
        </main>
        <Footer />
      </Providers>
    </LocaleProvider>
  );
}
