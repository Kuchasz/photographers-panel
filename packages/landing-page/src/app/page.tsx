"use client";

import { routes } from "@pp/api/dist/site/routes";
import Image from "next/image";
import Link from "next/link";
import { strings } from "../resources";

export default function Home() {

  return (
    <>
      <div className="bg-gradient-to-b from-stone-50 to-white">
        <section className="container mx-auto px-4 py-24">
          <h1 className="mb-6 font-serif text-5xl font-light tracking-wide text-stone-800 md:text-6xl lg:text-7xl" dangerouslySetInnerHTML={{ __html: strings.offer.slogan.title }}></h1>
          <h2 className="mb-16 font-light italic tracking-wide text-stone-600 md:text-xl lg:text-2xl">{strings.offer.slogan.description}</h2>

          <article className="mb-20 rounded-lg bg-white/80 p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            <h1 className="mb-4 font-serif text-3xl font-light text-stone-800">{strings.offer.slogan.middle.title}</h1>
            <h2 className="mb-8 text-lg font-light leading-relaxed text-stone-600">{strings.offer.slogan.middle.description}</h2>

            <Link 
              href={routes.offers.route}
              className="inline-block rounded-full border-2 border-stone-200 bg-white px-8 py-3 text-stone-800 transition duration-300 hover:border-stone-300 hover:bg-stone-50 hover:shadow-lg"
            >
              {strings.offer.slogan.middle.more}
            </Link>
          </article>

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
          <h1 className="mb-6 font-serif text-4xl font-light tracking-wide text-stone-800" dangerouslySetInnerHTML={{ __html: strings.article.title }}></h1>
          <h2 className="font-light italic tracking-wide text-stone-600">{strings.article.description}</h2>
        </section>
      </div>
      <div className="bg-white">
        <section className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-serif text-4xl font-light tracking-wide text-stone-800">{strings.contact.slogan.title}</h1>
            <h2 className="font-light italic tracking-wide text-stone-600">{strings.contact.slogan.description}</h2>
          </div>

          <div className="text-center">
            <h1 className="mb-3 font-serif text-2xl font-light text-stone-800">{strings.contact.email}</h1>
            <h2 className="text-xl text-stone-400 hover:text-stone-500">{strings.contact.phone}</h2>
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
