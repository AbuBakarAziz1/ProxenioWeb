import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'el' }];
}

export default function LocaleLayout({ children, params: { locale } }) {
  let messages;
  try {
    messages = require(`../../messages/${locale}.json`);
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
