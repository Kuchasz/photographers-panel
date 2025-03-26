import { FacebookLogo, InstagramLogo, MapPin, Phone, ArrowUp } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { routes } from "~/routes";
import { Button } from "../../components/button";
import { SectionTitle } from "../../components/section-title";
import { strings } from "../../resources";
import { getInstagramPosts, getOpinions, getFeaturedPhotos } from "./actions";
import { InstagramGrid, OpinionCarousel, PhotoGrid } from "./components.client";

const ContactLink = ({
  href,
  icon: Icon,
  text,
  external = false
}: {
  href: string;
  icon: React.ElementType;
  text: string;
  external?: boolean;
}) => (
  <Link
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="group inline-flex items-center gap-4 text-stone-600 transition-colors hover:text-stone-800"
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-section-background/80 backdrop-blur-sm transition-all group-hover:bg-gold-100">
      <Icon size={20} weight="light" className="transform text-gold-600 transition-transform group-hover:scale-125" />
    </span>
    <span className="font-serif text-xl font-light">{text}</span>
  </Link>
);

export default async function Home() {
  const opinions = await getOpinions();
  const instagramPosts = await getInstagramPosts();
  const featuredPhotos = await getFeaturedPhotos();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Photos Portfolio Section */}
      <section className="w-full bg-white py-16 md:py-24">
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

      {/* Testimonials Section */}
      <section className="w-full bg-section-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.opinions.title}
            subtitle={strings.opinions.subtitle}
          />
          <div className="mx-auto max-w-5xl">
            <OpinionCarousel opinions={opinions} />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Our Advantages"
            subtitle="What makes us special"
          />
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <ul className="space-y-6">
                {strings.offer.slogan.advantages.slice(0, 4).map((adv) => (
                  <li key={adv} className="flex items-start text-stone-700">
                    <span className="mr-3 mt-1 text-xl text-gold-300">♥</span>
                    <span className="font-light tracking-wide">{adv}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-6">
                {strings.offer.slogan.advantages.slice(4).map((adv) => (
                  <li key={adv} className="flex items-start text-stone-700">
                    <span className="mr-3 mt-1 text-xl text-gold-300">♥</span>
                    <span className="font-light tracking-wide">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="w-full bg-section-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.article.title}
            subtitle={strings.article.description}
          />
          <div className="flex justify-center">
            <ContactLink
              href="https://maps.app.goo.gl/KQ9RSySeL2xHvvvA7"
              icon={MapPin}
              text={strings.contact.map}
              external={true}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="pricing" className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.contact.slogan.title}
            subtitle={strings.contact.slogan.description}
          />

          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex justify-center">
              <Button href={routes.contact.route} variant="hero">
                {strings.contact.form.submit}
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12 lg:gap-16">
              <ContactLink
                href={`tel:${strings.contact.phone}`}
                icon={Phone}
                text={strings.contact.phone}
              />
              <ContactLink
                href="https://instagram.com/pyszstudio"
                icon={InstagramLogo}
                text="pyszstudio"
                external={true}
              />
              <ContactLink
                href="https://facebook.com/pyszstudio"
                icon={FacebookLogo}
                text="pyszstudio"
                external={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="w-full bg-section-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={strings.instagram.title}
            subtitle={strings.instagram.subtitle}
          />

          <div className="mx-auto max-w-5xl">
            <InstagramGrid posts={instagramPosts} />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full bg-zinc-200 py-12">
        <div className="container mx-auto px-4">
        </div>
      </footer>
    </div>
  );
}
