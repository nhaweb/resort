import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { manrope } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);
  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${manrope.variable} h-full`}>
      <body className={`${manrope.className} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
