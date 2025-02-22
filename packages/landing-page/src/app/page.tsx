"use client";

import { routes } from "@pp/api/dist/site/routes";
import Image from "next/image";
import Link from "next/link";
import { strings } from "../resources";

export default function Home() {

  return (
    <>
      <div>
        <section>
          <h1 dangerouslySetInnerHTML={{ __html: strings.offer.slogan.title }}></h1>
          <h2>{strings.offer.slogan.description}</h2>

          <article>
            <h1>{strings.offer.slogan.middle.title}</h1>
            <h2>{strings.offer.slogan.middle.description}</h2>

            <Link href={routes.offers.route}>
              {strings.offer.slogan.middle.more}
            </Link>
          </article>

          <hgroup>
            <ul>
              {strings.offer.slogan.advantages.slice(0, 4).map((adv) => (
                <li key={adv}>{adv}</li>
              ))}
            </ul>
            <ul>
              {strings.offer.slogan.advantages.slice(4).map((adv) => (
                <li key={adv}>{adv}</li>
              ))}
            </ul>
          </hgroup>
        </section>
      </div>
      <div>
        <section>
          <h1 dangerouslySetInnerHTML={{ __html: strings.article.title }}></h1>
          <h2>{strings.article.description}</h2>

          <hgroup>
            <Image
              width={450}
              height={344}
              src="/images/map.png"
              alt="malopolskie_map"
              id="map"
            />
          </hgroup>
        </section>
      </div>
      <div>
        <section>
          <div>
            <h1>{strings.contact.slogan.title}</h1>
            <h2>{strings.contact.slogan.description}</h2>
          </div>

          <div>
            <h1>{strings.contact.email}</h1>
            <h2>{strings.contact.phone}</h2>
          </div>
        </section>
      </div>

      <div>
        <section>
          <div></div>
          <address>
            {strings.contact.address.map((addr) => (
              <div key={addr}>
                {addr}
              </div>
            ))}
          </address>
        </section>
      </div>
    </>
  );
}
