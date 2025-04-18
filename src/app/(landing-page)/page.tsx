import { FacebookLogo, InstagramLogo, Mailbox, Phone } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { routes } from "~/routes";
import { Button } from "../../components/button";
import { SectionTitle } from "../../components/section-title";
import { strings } from "../../resources";
import { getFeaturedPhotos, getFeaturedVideos, getOpinions } from "./actions";
import { FeaturedVideos, OpinionCarousel, PhotoGrid } from "~/components/landing-page";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const opinions = await getOpinions();
  const featuredPhotos = await getFeaturedPhotos();
  const featuredVideos = await getFeaturedVideos();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Meet Your Photographer Section */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.meetPhotographer.title}
            subtitle={strings.meetPhotographer.subtitle}
          />

          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center">
              {/* Image Column - temporarily hidden */}
              {/*<div className="w-full md:w-1/2">
                <div className="overflow-hidden rounded-md shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=687&auto=format&fit=crop"
                    alt="Ewa i Piotr - Fotografowie i filmowcy ślubni"
                    width={600}
                    height={700}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>*/}

              {/* Text Column */}
              <div className="w-full space-y-6">
                <p className="font-serif text-lg italic leading-relaxed text-stone-700">
                  {strings.meetPhotographer.intro}
                </p>

                <p className="font-light leading-relaxed text-stone-600">
                  {strings.meetPhotographer.experience}
                </p>

                <p className="font-light leading-relaxed text-stone-600">
                  {strings.meetPhotographer.promise}
                </p>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <Button
                    href={routes.contact.route}
                    variant="default"
                  >
                    {strings.meetPhotographer.sayHello}
                  </Button>
                  <Button
                    href={routes.contact.route}
                    variant="outline"
                  >
                    {strings.meetPhotographer.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos Portfolio Section */}
      <section className="w-full bg-section-background py-16 md:py-24">
        <div className="mb-8">
          <SectionTitle
            title={strings.featuredPhotos.title}
            subtitle={strings.featuredPhotos.subtitle}
          />
        </div>
        <div className="w-full">
          <PhotoGrid photos={featuredPhotos} />
        </div>
      </section>

      {/* Videos Portfolio Section */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.featuredVideos.title}
            subtitle={strings.featuredVideos.subtitle}
          />
          <div className="mx-auto max-w-7xl">
            <FeaturedVideos videos={featuredVideos} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-section-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.opinions.title}
            subtitle={strings.opinions.subtitle}
          />
          <div className="mx-auto max-w-3xl mb-12 text-center">
            <p className="font-light leading-relaxed text-stone-600 mb-4">
              {strings.opinions.description}
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <OpinionCarousel opinions={opinions} />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.advantages.title}
            subtitle={strings.advantages.subtitle}
          />

          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                {strings.advantages.description}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-10">
              {/* Left Column */}
              <div>
                <ul className="space-y-6">
                  {strings.advantages.items.left.map((item, index) => (
                    <li key={index} className="flex">
                      <span className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                        ❤
                      </span>
                      <div>
                        <h4 className="font-medium text-stone-900">{item.title}</h4>
                        <p className="font-light text-sm leading-relaxed text-stone-600">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column */}
              <div>
                <ul className="space-y-6">
                  {strings.advantages.items.right.map((item, index) => (
                    <li key={index} className="flex">
                      <span className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                        ❤
                      </span>
                      <div>
                        <h4 className="font-medium text-stone-900">{item.title}</h4>
                        <p className="font-light text-sm leading-relaxed text-stone-600">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Button href={routes.offers.route} variant="default">
                {strings.advantages.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="w-full bg-section-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.location.title}
            subtitle={strings.location.subtitle}
          />

          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                {strings.location.description}
              </p>
            </div>

            <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-stretch">
              {/* Areas we cover */}
              <div className="w-full rounded-lg bg-white p-6 shadow-md md:w-1/2">
                <h3 className="mb-4 font-serif text-xl font-medium text-stone-800">
                  {strings.location.mainAreas}
                </h3>
                <ul className="space-y-4">
                  {strings.location.areas.map((area) => (
                    <li key={area} className="flex items-center text-stone-700">
                      <span className="mr-3 text-gold-500">▹</span>
                      <span className="font-light">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location info */}
              <div className="flex w-full flex-col justify-between rounded-lg bg-white p-6 shadow-md md:w-1/2">
                <div>
                  <h3 className="mb-4 font-serif text-xl font-medium text-stone-800">
                    Informacje
                  </h3>
                  <p className="mb-4 font-light leading-relaxed text-stone-600">
                    {strings.location.locationInfo}
                  </p>
                  <p className="mb-6 font-medium text-gold-600">
                    {strings.location.noExtraCharge}
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <Button href={routes.contact.route} variant="default">
                    {strings.location.cta}
                  </Button>
                  <Button
                    href="https://maps.app.goo.gl/KQ9RSySeL2xHvvvA7"
                    variant="outline"
                  >
                    {strings.location.mapCta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.contact.contactUs.title}
            subtitle={strings.contact.contactUs.subtitle}
          />

          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mx-auto max-w-3xl font-light leading-relaxed text-stone-600 mb-4">
                {strings.contact.contactUs.description}
              </p>
            </div>

            <div className="mb-12 rounded-lg bg-gold-50 p-6 text-center shadow-sm">
              <p className="font-light leading-relaxed text-gold-700">
                {strings.contact.contactUs.checkAvailability}
              </p>
            </div>

            <div className="mb-12 grid gap-6 md:grid-cols-3 md:gap-8">
              {/* Phone Contact */}
              <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
                <h3 className="mb-4 font-serif text-xl font-medium text-stone-800">
                  {strings.contact.contactUs.phoneTitle}
                </h3>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
                  <Phone size={28} weight="light" className="text-gold-600" />
                </div>
                <p className="mb-2 font-light leading-relaxed text-stone-600">{strings.contact.phoneLabel}</p>
                <a
                  href={`tel:${strings.contact.phone}`}
                  className="text-gold-600 transition-colors hover:text-gold-700"
                >
                  {strings.contact.phone}
                </a>
              </div>

              {/* Email Contact */}
              <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
                <h3 className="mb-4 font-serif text-xl font-medium text-stone-800">
                  {strings.contact.contactUs.emailTitle}
                </h3>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
                  <Mailbox size={28} weight="light" className="text-gold-600" />
                </div>
                <p className="mb-2 font-light leading-relaxed text-stone-600">{strings.contact.emailLabel}</p>
                <a
                  href={`mailto:${strings.contact.email}`}
                  className="text-gold-600 transition-colors hover:text-gold-700"
                >
                  {strings.contact.email}
                </a>
              </div>

              {/* Social Media Contact */}
              <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
                <h3 className="mb-4 font-serif text-xl font-medium text-stone-800">
                  {strings.contact.contactUs.socialTitle}
                </h3>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
                  <InstagramLogo size={28} weight="light" className="text-gold-600" />
                </div>
                <div className="flex flex-col space-y-2">
                  <a
                    href="https://instagram.com/pyszstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-gold-600 transition-colors hover:text-gold-700"
                  >
                    <InstagramLogo size={16} />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://facebook.com/pyszstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-gold-600 transition-colors hover:text-gold-700"
                  >
                    <FacebookLogo size={16} />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                href={routes.contact.route}
                variant="hero"
              >
                {strings.contact.form.submit}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
