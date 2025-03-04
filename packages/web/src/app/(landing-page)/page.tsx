"use client";

import { FacebookLogo, InstagramLogo, MapPin, Phone, Star } from "@phosphor-icons/react";

import Link from "next/link";
import { Button } from "../../components/button";
import { strings } from "../../resources";
import { useEffect, useState } from "react";
import { routes } from "~/routes";

type Opinion = {
  id: number;
  author: string;
  content: string;
  rating: number;
  source: "google" | "facebook";
  date: string;
};

// Sample opinions - to be replaced with real ones
const opinions: Opinion[] = [
  {
    id: 1,
    author: "Anna Kowalska",
    content: "Wspaniałe podejście do klienta, profesjonalna sesja i piękne zdjęcia. Polecam!",
    rating: 5,
    source: "google",
    date: "2024-01"
  },
  {
    id: 2,
    author: "Piotr Nowak",
    content: "Świetna atmosfera podczas sesji, naturalne ujęcia i profesjonalna obróbka. Bardzo polecam!",
    rating: 5,
    source: "facebook",
    date: "2024-02"
  },
  {
    id: 3,
    author: "Marta Wiśniewska",
    content: "Zdjęcia przeszły nasze najśmielsze oczekiwania. Dziękujemy za uwiecznienie tych wyjątkowych chwil!",
    rating: 5,
    source: "google",
    date: "2024-03"
  },
];

export default function Home() {
  const [currentOpinionIndex, setCurrentOpinionIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOpinionIndex((prev) => (prev + 1) % opinions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-b from-stone-50 to-white">
        <section className="container mx-auto px-4 py-24">
          <h1 className="mb-6 font-serif text-5xl font-light tracking-wide text-stone-800 md:text-6xl lg:text-7xl" dangerouslySetInnerHTML={{ __html: strings.offer.slogan.title }}></h1>
          <h2 className="mb-16 font-light italic tracking-wide text-stone-600 md:text-xl lg:text-2xl">{strings.offer.slogan.description}</h2>

          <article className="mb-20 rounded-lg bg-white/80 p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            <h1 className="mb-4 font-serif text-3xl font-light text-stone-800">{strings.offer.slogan.middle.title}</h1>
            <h2 className="mb-8 text-lg font-light leading-relaxed text-stone-600">{strings.offer.slogan.middle.description}</h2>

            <Button href={routes.offers.route}>
              {strings.offer.slogan.middle.more}
            </Button>
          </article>
        </section>
      </div>

      <div className="bg-stone-50">
        <section className="container mx-auto px-4 py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-4xl font-light tracking-wide text-stone-800">{strings.opinions.title}</h2>
            <p className="font-light italic tracking-wide text-stone-600">{strings.opinions.subtitle}</p>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="relative min-h-[200px] overflow-hidden rounded-lg bg-white p-8 shadow-lg">
              {opinions.map((opinion, index) => (
                <div
                  key={opinion.id}
                  className={`absolute inset-0 flex transform flex-col justify-between p-8 transition-all duration-500 ${index === currentOpinionIndex ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                    }`}
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="font-serif text-xl font-light text-stone-800">{opinion.author}</p>
                        <p className="text-sm font-light text-stone-500">{strings.opinions.sources[opinion.source]}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: opinion.rating }).map((_, i) => (
                          <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="font-light leading-relaxed text-stone-600">{opinion.content}</p>
                  </div>
                  <p className="text-right text-sm font-light text-stone-400">{opinion.date}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {opinions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOpinionIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${index === currentOpinionIndex ? "bg-stone-400" : "bg-stone-200"
                    }`}
                  aria-label={`Go to opinion ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="bg-white">
        <section className="container mx-auto px-4 py-24">
          <hgroup className="grid gap-12 md:grid-cols-2">
            <ul className="space-y-6">
              {strings.offer.slogan.advantages.slice(0, 4).map((adv) => (
                <li key={adv} className="flex items-center text-stone-700">
                  <span className="mr-3 text-stone-300">♥</span>
                  <span className="font-light tracking-wide">{adv}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-6">
              {strings.offer.slogan.advantages.slice(4).map((adv) => (
                <li key={adv} className="flex items-center text-stone-700">
                  <span className="mr-3 text-stone-300">♥</span>
                  <span className="font-light tracking-wide">{adv}</span>
                </li>
              ))}
            </ul>
          </hgroup>
        </section>
      </div>
      <div className="bg-stone-50">
        <section className="container mx-auto px-4 py-24">
          <div className="mb-12 text-center">
            <h1 className="mb-6 font-serif text-4xl font-light tracking-wide text-stone-800">{strings.article.title}</h1>
            <h2 className="mb-8 font-light italic tracking-wide text-stone-600">{strings.article.description}</h2>
            <Link
              href="https://maps.app.goo.gl/KQ9RSySeL2xHvvvA7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 text-stone-600 transition-colors hover:text-stone-800"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                <MapPin size={20} weight="light" />
              </span>
              <span className="font-serif text-xl font-light">{strings.contact.map}</span>
            </Link>
          </div>
        </section>
      </div>
      <div className="bg-white">
        <section className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-serif text-4xl font-light tracking-wide text-stone-800">{strings.contact.slogan.title}</h1>
            <h2 className="font-light italic tracking-wide text-stone-600">{strings.contact.slogan.description}</h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex justify-center">
              <Button href={routes.contact.route}>
                {strings.contact.form.submit}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12">
              <Link
                href={`tel:${strings.contact.phone}`}
                className="inline-flex items-center gap-4 text-stone-600 transition-colors hover:text-stone-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                  <Phone size={20} weight="light" />
                </span>
                <span className="font-serif text-xl font-light">{strings.contact.phone}</span>
              </Link>
              <Link
                href="https://instagram.com/pyszstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 text-stone-600 transition-colors hover:text-stone-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                  <InstagramLogo size={20} weight="light" />
                </span>
                <span className="font-serif text-xl font-light">pyszstudio</span>
              </Link>
              <Link
                href="https://facebook.com/pyszstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 text-stone-600 transition-colors hover:text-stone-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                  <FacebookLogo size={20} weight="light" />
                </span>
                <span className="font-serif text-xl font-light">pyszstudio</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-stone-50">
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 h-px bg-stone-100"></div>
          <address className="text-center font-light tracking-wide text-stone-600">
            {strings.contact.address.map((addr) => (
              <div key={addr} className="mb-2">
                {addr}
              </div>
            ))}
          </address>
        </section>
      </div>
    </>
  );
}
