import { FacebookLogo, InstagramLogo, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { routes } from "~/routes";
import { Button } from "../../components/button";
import { strings } from "../../resources";
import { getOpinions } from "./actions";
import { OpinionCarousel } from "./page.client";

export default async function Home() {
  const opinions = await getOpinions();

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
          <OpinionCarousel opinions={opinions} />
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
