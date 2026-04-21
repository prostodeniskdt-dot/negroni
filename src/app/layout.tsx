import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Музей Негрони — 100+ вариаций по всей России',
    template: '%s | Музей Негрони',
  },
  description:
    'Музей Негрони — онлайн-коллекция и карта более 100 вариаций коктейля Негрони по городам России и мира: рецепты, вдохновение для баров и домашнего бара.',
  keywords: ['негрони', 'negroni', 'коктейль', 'рецепт', 'бар', 'коктейльная карта', 'музей негрони', 'campari', 'кампари'],
  authors: [{ name: 'BAR BOSS ONLINE' }],
  creator: 'Виталий Аршук',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'en_US',
    url: 'https://museynegroni.ru',
    siteName: 'Музей Негрони',
    title: 'Музей Негрони — 100+ вариаций по всей России',
    description: 'Онлайн-коллекция и интерактивная карта более 100 вариаций коктейля Негрони по городам России и мира.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Классический коктейль Негрони',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Музей Негрони — 100+ вариаций по всей России',
    description: 'Онлайн-коллекция и интерактивная карта более 100 вариаций коктейля Негрони.',
    images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Перейти к содержимому</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Музей Негрони',
              alternateName: 'The Negroni Museum',
              url: 'https://museynegroni.ru',
              description: 'Онлайн-коллекция и интерактивная карта более 100 вариаций коктейля Негрони по городам России и мира.',
              publisher: {
                '@type': 'Organization',
                name: 'BAR BOSS ONLINE',
                founder: {
                  '@type': 'Person',
                  name: 'Виталий Аршук',
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://museynegroni.ru/collection?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Providers>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
