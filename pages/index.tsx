import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const features = [
  {
    number: '01',
    title: 'AI Farming Assistant',
    description:
      'Get practical guidance on crops, fertilizers, irrigation, and everyday farming questions.',
    href: '/chat',
    icon: '✳',
    tag: 'AI powered',
  },
  {
    number: '02',
    title: 'Weather & Forecast',
    description:
      'Check weather conditions to plan fieldwork and make better-informed crop decisions.',
    href: '/weather',
    icon: '☀',
    tag: 'Weather insights',
  },
  {
    number: '03',
    title: 'Crop Health',
    description:
      'Upload crop images to explore possible pest and disease issues.',
    href: '/pest-detect',
    icon: '⌕',
    tag: 'Image analysis',
  },
  {
    number: '04',
    title: 'Mandi Prices',
    description:
      'Explore available market-price information before deciding where to sell.',
    href: '/market',
    icon: '↗',
    tag: 'Market insights',
  },
  {
    number: '05',
    title: 'Share Feedback',
    description:
      'Tell us how we can make your farming experience simpler and more useful.',
    href: '/feedback',
    icon: '♡',
    tag: 'Your voice matters',
  },
];

const translations = {
  English: {
    eyebrow: 'A smarter way to grow',
    title: 'Better farming',
    accent: 'starts with better decisions.',
    description:
      'Your everyday farming companion for crop guidance, weather insights, plant health, and market information.',
    primary: 'Explore AI assistant',
    secondary: 'Explore our tools',
    tools: 'Everything you need,',
    toolsAccent: 'all in one place.',
    toolsDescription:
      'Simple, practical tools designed to help you make more informed farming decisions.',
    why: 'Technology with a purpose.',
    whyDescription:
      'Useful agricultural information, presented in a way that is easier to understand and act on.',
    points: [
      ['Made for farmers', 'Straightforward tools for everyday agricultural questions.'],
      ['Built around your needs', 'Explore crop, weather, and market information in one place.'],
      ['Designed for everyone', 'A responsive experience across phones, tablets, and computers.'],
    ],
    cta: 'Your next growing season starts with a better decision.',
    ctaDescription:
      'Ask a farming question and explore the tools available to support your work.',
    start: 'Ask your first question',
    footer: 'Growing knowledge. Supporting farmers.',
    feedback: 'Share feedback',
  },
  Hindi: {
    eyebrow: 'खेती करने का एक बेहतर तरीका',
    title: 'बेहतर खेती',
    accent: 'की शुरुआत सही फैसलों से।',
    description:
      'फसल की सलाह, मौसम की जानकारी, पौधों की सेहत और मंडी भाव के लिए आपका खेती साथी।',
    primary: 'AI सहायक से पूछें',
    secondary: 'हमारे टूल देखें',
    tools: 'खेती के उपयोगी टूल,',
    toolsAccent: 'एक ही जगह।',
    toolsDescription: 'खेती से जुड़े फैसले लेने में मदद करने वाले आसान और उपयोगी टूल।',
    why: 'किसानों के लिए उपयोगी तकनीक।',
    whyDescription: 'खेती की जानकारी को आसान भाषा में समझें और बेहतर फैसले लें।',
    points: [
      ['किसानों के लिए', 'रोज़मर्रा की खेती के लिए आसान टूल।'],
      ['आपकी ज़रूरतों के अनुसार', 'फसल, मौसम और मंडी की जानकारी एक जगह।'],
      ['हर डिवाइस पर', 'मोबाइल और कंप्यूटर के लिए सुविधाजनक डिज़ाइन।'],
    ],
    cta: 'बेहतर फैसलों के साथ नई शुरुआत करें।',
    ctaDescription: 'खेती से जुड़ा अपना सवाल पूछें और उपलब्ध टूल देखें।',
    start: 'अपना सवाल पूछें',
    footer: 'ज्ञान बढ़ाएँ। किसानों को सशक्त बनाएँ।',
    feedback: 'सुझाव दें',
  },
  Marathi: {
    eyebrow: 'शेती करण्याची अधिक चांगली पद्धत',
    title: 'चांगली शेती',
    accent: 'योग्य निर्णयांपासून सुरू होते.',
    description:
      'पीक सल्ला, हवामान, पिकांचे आरोग्य आणि बाजारभाव यांसाठी तुमचा शेती साथीदार.',
    primary: 'AI सहाय्यकाला विचारा',
    secondary: 'आमची साधने पाहा',
    tools: 'शेतीसाठी उपयुक्त साधने,',
    toolsAccent: 'एकाच ठिकाणी.',
    toolsDescription:
      'शेतीविषयक माहिती समजून घेण्यासाठी आणि योग्य निर्णय घेण्यासाठी सोपी साधने.',
    why: 'शेतकऱ्यांसाठी उपयुक्त तंत्रज्ञान.',
    whyDescription:
      'शेतीविषयक माहिती सोप्या पद्धतीने समजून घ्या आणि अधिक माहितीपूर्ण निर्णय घ्या.',
    points: [
      ['शेतकऱ्यांसाठी', 'दैनंदिन शेतीसाठी सोपी साधने.'],
      ['तुमच्या गरजांसाठी', 'पीक, हवामान आणि बाजारभावाची माहिती एकाच ठिकाणी.'],
      ['प्रत्येक उपकरणासाठी', 'मोबाइल आणि संगणकावर वापरण्यास सोपी रचना.'],
    ],
    cta: 'चांगल्या निर्णयांसह नव्या हंगामाची सुरुवात करा.',
    ctaDescription: 'शेतीविषयक प्रश्न विचारा आणि उपलब्ध साधने वापरून पाहा.',
    start: 'तुमचा प्रश्न विचारा',
    footer: 'ज्ञान वाढवा. शेतकऱ्यांना साथ द्या.',
    feedback: 'अभिप्राय द्या',
  },
};

type Language = keyof typeof translations;

export default function Home() {
  const [language, setLanguage] = useState<Language>('English');
  const copy = translations[language];

  return (
    <>
      <Head>
        <title>KrishiSethuu | Smarter Farming, Better Decisions</title>
        <meta
          name="description"
          content="Explore AI farming assistance, weather information, crop health tools, and mandi prices with KrishiSethuu."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f7f8f1" />
      </Head>

      <div className="min-h-screen overflow-hidden bg-[#f7f8f1] text-[#203c2b]">
        <Header />

        <main>
          {/* Hero */}
          <section className="relative px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pt-24">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d8e4d3] bg-white/80 px-4 py-2 text-sm font-medium text-[#356a43]">
                  <span className="h-2 w-2 rounded-full bg-[#6c9c5b]" />
                  {copy.eyebrow}
                </div>

                <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-[#203c2b] sm:text-5xl lg:text-7xl">
                  {copy.title}{' '}
                  <span className="font-serif italic text-[#59854c]">
                    {copy.accent}
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-[#647365] sm:text-lg">
                  {copy.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/chat"
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#285b3b] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#1d472d] focus:outline-none focus:ring-2 focus:ring-[#78a96a] focus:ring-offset-2"
                  >
                    {copy.primary}
                    <span aria-hidden="true">↗</span>
                  </Link>

                  <a
                    href="#farming-tools"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d9e1d5] bg-white px-6 py-3 font-semibold text-[#31543a] transition hover:bg-[#edf2e8] focus:outline-none focus:ring-2 focus:ring-[#78a96a] focus:ring-offset-2"
                  >
                    {copy.secondary}
                  </a>
                </div>

                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#667668]">
                  <span>✓ English, हिंदी, मराठी</span>
                  <span>✓ Farming tools in one place</span>
                </div>
              </div>

              {/* Nature-inspired visual with real farm photography */}
              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#e8edcf] blur-2xl" />
                <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-[#dce9d6] blur-2xl" />

                <div className="relative isolate overflow-hidden rounded-[2rem] border border-white bg-[#e6eddb] p-4 shadow-[0_24px_70px_-32px_rgba(32,60,43,0.35)] sm:p-6">
                  <div
                    role="img"
                    aria-label="Farmer working among green crops in a sunlit field"
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/krishisethuu-hero.png')" }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 bg-gradient-to-br from-[#f7f8f1]/25 via-transparent to-[#244d33]/20"
                  />

                  <div className="relative z-10 flex items-center justify-between gap-4 rounded-2xl bg-[#fdfdf9]/95 p-4 shadow-sm backdrop-blur-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#78906e]">
                        KRISHISETHUU
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#294b32]">
                        Your farm, in focus.
                      </p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0df] text-2xl">
                      🌱
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
                    <Link
                      href="/weather"
                      className="rounded-2xl bg-[#315e43]/95 p-4 text-white shadow-sm transition hover:bg-[#244a33]"
                    >
                      <span className="text-2xl" aria-hidden="true">☀</span>
                      <p className="mt-5 text-sm text-white/80">Plan your day</p>
                      <p className="mt-1 font-semibold">Weather</p>
                    </Link>

                    <Link
                      href="/pest-detect"
                      className="rounded-2xl bg-white/95 p-4 shadow-sm transition hover:bg-white"
                    >
                      <span className="text-2xl" aria-hidden="true">🌿</span>
                      <p className="mt-5 text-sm text-[#7a8a79]">Check your crops</p>
                      <p className="mt-1 font-semibold text-[#294b32]">Crop health</p>
                    </Link>
                  </div>

                  <Link
                    href="/chat"
                    className="relative z-10 mt-3 flex items-center gap-3 rounded-2xl border border-[#dce6d6] bg-white/95 p-4 shadow-sm transition hover:border-[#8cab7d]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f1e4] text-xl">
                      ✳
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-[#7a8a79]">
                        YOUR FARMING COMPANION
                      </span>
                      <span className="mt-1 block font-semibold text-[#294b32]">
                        Ask your AI assistant
                      </span>
                    </span>
                    <span className="text-lg text-[#56834b]" aria-hidden="true">↗</span>
                  </Link>

                  <div className="relative z-10 mt-4 flex items-center justify-between rounded-xl bg-[#dce7d2]/95 px-4 py-3 text-sm text-[#3c6442] backdrop-blur-sm">
                    <span>Growing with knowledge</span>
                    <span aria-hidden="true">✳ ✳ ✳</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Farming tools */}
          <section id="farming-tools" className="scroll-mt-8 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#668b58]">
                    YOUR FARMING TOOLKIT
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#203c2b] sm:text-4xl">
                    {copy.tools}{' '}
                    <span className="font-serif italic text-[#59854c]">
                      {copy.toolsAccent}
                    </span>
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-[#6b796c]">
                    {copy.toolsDescription}
                  </p>
                </div>
                <span className="text-sm text-[#7b887a]">05 useful tools</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="group rounded-2xl border border-[#e5e9df] bg-[#fbfcf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#b9cfad] hover:bg-white hover:shadow-[0_14px_36px_-24px_rgba(32,60,43,0.35)] focus:outline-none focus:ring-2 focus:ring-[#78a96a] focus:ring-offset-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f0e2] text-2xl text-[#356a43]">
                        {feature.icon}
                      </span>
                      <span className="text-xs font-medium tracking-wider text-[#94a28f]">
                        {feature.number}
                      </span>
                    </div>

                    <p className="mt-6 text-xs font-medium uppercase tracking-wider text-[#73906b]">
                      {feature.tag}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#294b32]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-[#6b796c]">
                      {feature.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#477649]">
                      Explore tool
                      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Why KrishiSethuu */}
          <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#668b58]">
                  OUR APPROACH
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#203c2b] sm:text-4xl">
                  {copy.why}
                </h2>
                <p className="mt-4 max-w-lg leading-8 text-[#6b796c]">
                  {copy.whyDescription}
                </p>
                <Link
                  href="/chat"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-[#477649] hover:text-[#285b3b]"
                >
                  {copy.primary} <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="space-y-4">
                {copy.points.map((point, index) => (
                  <div key={point[0]} className="flex gap-4 rounded-2xl border border-[#e2e8dc] bg-white p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f0e2] font-semibold text-[#477649]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#294b32]">{point[0]}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#6b796c]">{point[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to action */}
          <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#244d33] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full border border-white/10" />

              <p className="relative text-sm font-medium uppercase tracking-[0.18em] text-[#c5dbb7]">
                A LITTLE KNOWLEDGE GOES A LONG WAY
              </p>
              <h2 className="relative mx-auto mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
                {copy.cta}
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl leading-7 text-white/75">
                {copy.ctaDescription}
              </p>
              <Link
                href="/chat"
                className="relative mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#f5f4e9] px-7 py-3 font-semibold text-[#244d33] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#244d33]"
              >
                {copy.start} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#e1e7dc] bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#285b3b] text-xl text-white">
                🌱
              </span>
              <span>
                <span className="block font-semibold text-[#294b32]">KrishiSethuu</span>
                <span className="block text-xs text-[#7b887a]">{copy.footer}</span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-5 text-sm text-[#6b796c]">
              <Link href="/chat" className="hover:text-[#285b3b]">{copy.primary}</Link>
              <Link href="/feedback" className="hover:text-[#285b3b]">{copy.feedback}</Link>
              <label className="flex items-center gap-2">
                <span className="sr-only">Choose language</span>
                <select
                  value={language}
                  onChange={(event) =>
  setLanguage(event.target.value as Language)
}
                  className="rounded-lg border border-[#dce4d7] bg-[#f7f8f1] px-3 py-2 text-sm text-[#294b32] focus:outline-none focus:ring-2 focus:ring-[#78a96a]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी</option>
                  <option value="Marathi">मराठी</option>
                </select>
              </label>
            </div>

            <p className="text-xs text-[#879184]">
              © {new Date().getFullYear()} KrishiSethuu
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}