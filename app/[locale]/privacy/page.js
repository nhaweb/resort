import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import SiteNav from "@/components/SiteNav";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { privacy } = getDictionary(locale);
  return {
    title: privacy.metaTitle,
    description: privacy.metaDescription,
  };
}

/**
 * @param {{ body: string, email: string }} props
 */
function PolicyBody({ body, email }) {
  const [before, after] = body.split("{email}");
  if (after === undefined) return <p>{body}</p>;
  return (
    <p>
      {before}
      <Link className="link-plain" href={`mailto:${email}`}>
        {email}
      </Link>
      {after}
    </p>
  );
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);
  const { privacy, site } = dictionary;

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <Link className="sr-only" href="#privacy">
        {dictionary.ui.skipToContent}
      </Link>
      <SiteNav variant="page" />
      <main id="privacy" className="rooms legal">
        <header className="rooms__head">
          <p className="rooms__eyebrow">{site.name}</p>
          <h1 className="rooms__title">{privacy.title}</h1>
          <p className="rooms__lead">{privacy.lead}</p>
        </header>
        <div className="legal__body">
          {privacy.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <PolicyBody body={section.body} email={site.email} />
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </LocaleProvider>
  );
}
