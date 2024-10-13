import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script'
import RootProviders from './RootProviders'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Recipe Finder | Upload Ingredients, Get Recipes",
  description: "Upload a photo of your ingredients and get instant recipe recommendations. Discover new dishes with what you have in your kitchen!",
  keywords: [
    // 영어 키워드
    "AI recipe finder, ingredient recognition, photo recipe search",
    "what to cook, recipe ideas, leftover ingredients recipes",
    "meal planner, cooking inspiration, easy recipes",
    "food recognition app, smart kitchen assistant, culinary AI",
    "quick dinner ideas, recipe generator, ingredient-based cooking",
    // 한국어 키워드
    "AI 레시피 찾기, 재료 인식, 사진으로 요리법 찾기",
    "오늘 뭐 먹지, 레시피 아이디어, 남은 재료로 요리하기",
    "식단 계획, 요리 영감, 간단한 요리법",
    "음식 인식 앱, 스마트 주방 도우미, 요리 AI",
    "빠른 저녁 메뉴, 레시피 생성기, 재료 기반 요리",
    // 일본어 키워드
    "AI レシピファインダー, 材料認識, 写真でレシピ検索",
    "今日の献立, レシピアイデア, 余り物でクッキング",
    "食事プランナー, 料理のインスピレーション, 簡単レシピ",
    "食材認識アプリ, スマートキッチンアシスタント, 料理AI",
    "クイック夕食アイデア, レシピジェネレーター, 材料ベースの料理",
    // 러시아어 키워드
    "ИИ поиск рецептов, распознавание ингредиентов, поиск рецептов по фото",
    "что приготовить, идеи рецептов, рецепты из остатков",
    "планировщик питания, кулинарное вдохновение, простые рецепты",
    "приложение распознавания еды, умный кухонный помощник, кулинарный ИИ",
    "быстрые идеи для ужина, генератор рецептов, готовка на основе ингредиентов"
  ].join(", "),
  openGraph: {
    title: "AI Recipe Finder - Turn Your Ingredients into Delicious Meals",
    description: "Upload a photo of your ingredients and let our AI suggest perfect recipes. Discover new dishes and reduce food waste!",
    images: [
      {
        url: "https://ingrecipe.ludgi.ai/logo.webp",
        width: 1200,
        height: 630,
        alt: "AI Recipe Finder App Interface",
      },
    ],
    locale: "en_US",
    type: "website",
    siteName: "AI Recipe Finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Recipe Finder - Photo to Recipe Magic",
    description: "Snap a pic of your ingredients, get instant recipe ideas. Cook smarter, reduce waste, and enjoy delicious meals!",
    images: ["https://ingrecipe.ludgi.ai/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const pubId = "ca-pub-5823741955283998"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={pubId} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <RootProviders>
          <main className="">{children}</main>
        </RootProviders>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Funding Choices 스크립트 */}
        <Script
          id="google-funding-choices"
          strategy="afterInteractive"
          src={`https://fundingchoicesmessages.google.com/i/${pubId}?ers=1`}
        />
        {/* Google FC Present 스크립트 */}
        <Script
          id="google-fc-present"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`
          }}
        />
      </body>
    </html>
  );
}
