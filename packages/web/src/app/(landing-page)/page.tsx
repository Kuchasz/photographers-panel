import { FacebookLogo, InstagramLogo, MapPin, Phone, ArrowUp } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { routes } from "~/routes";
import { Button } from "../../components/button";
import { PageContainer } from "../../components/page-container";
import { strings } from "../../resources";
import { getInstagramPosts, getOpinions } from "./actions";
import { InstagramGrid, OpinionCarousel } from "./components.client";

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
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100/80 backdrop-blur-sm transition-all group-hover:bg-stone-200">
      <Icon size={20} weight="light" className="transform transition-transform group-hover:scale-125" />
    </span>
    <span className="font-serif text-xl font-light">{text}</span>
  </Link>
);

// Section title component for consistency
const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mx-auto mb-12 max-w-3xl text-center">
    <h2 className="mb-4 font-serif text-3xl font-light tracking-wide text-stone-800 md:text-4xl">{title}</h2>
    <p className="font-light italic tracking-wide text-stone-600 md:text-lg">{subtitle}</p>
  </div>
);

export default async function Home() {
  const opinions = await getOpinions();
  const instagramPosts = await getInstagramPosts();

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4">
          <h1 
            className="mb-6 font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl lg:text-6xl" 
            dangerouslySetInnerHTML={{ __html: strings.offer.slogan.title }}
          />
          <h2 className="mb-16 max-w-3xl font-light italic tracking-wide text-stone-600 md:text-lg lg:text-xl">
            {strings.offer.slogan.description}
          </h2>

          <article className="relative rounded-lg bg-white/80 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-sm md:p-12 lg:max-w-3xl">
            <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-stone-50 md:-right-6 md:-top-6 md:h-24 md:w-24" />
            <h3 className="mb-4 font-serif text-2xl font-light text-stone-800 md:text-3xl">
              {strings.offer.slogan.middle.title}
            </h3>
            <p className="mb-8 font-light leading-relaxed text-stone-600 md:text-lg">
              {strings.offer.slogan.middle.description}
            </p>

            <Button href={routes.offers.route}>
              {strings.offer.slogan.middle.more}
            </Button>
          </article>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-stone-50 py-16 md:py-24">
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
      <section className="bg-white py-16 md:py-24">
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
                    <span className="mr-3 mt-1 text-xl text-rose-300">♥</span>
                    <span className="font-light tracking-wide">{adv}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-6">
                {strings.offer.slogan.advantages.slice(4).map((adv) => (
                  <li key={adv} className="flex items-start text-stone-700">
                    <span className="mr-3 mt-1 text-xl text-rose-300">♥</span>
                    <span className="font-light tracking-wide">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="bg-stone-50 py-16 md:py-24">
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
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title={strings.contact.slogan.title} 
            subtitle={strings.contact.slogan.description} 
          />

          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex justify-center">
              <Button href={routes.contact.route}>
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
      <section className="bg-stone-50 py-16 md:py-24">
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
      <footer className="relative bg-stone-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 h-px bg-stone-200"></div>
          <address className="text-center font-light tracking-wide text-stone-600">
            {strings.contact.address.map((addr) => (
              <div key={addr} className="mb-2">
                {addr}
              </div>
            ))}
          </address>
          
          {/* Back to top button */}
          <div className="absolute -top-6 right-6 lg:right-12">
            <Link 
              href="#top" 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              aria-label="Back to top"
            >
              <ArrowUp size={20} weight="bold" />
            </Link>
          </div>
        </div>
      </footer>
    </PageContainer>
  );
}
