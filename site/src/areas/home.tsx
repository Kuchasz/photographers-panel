import React from "react";
import { strings } from "../resources";
import { routes } from "../routes";
import { Link } from "react-router-dom";

const mapImage = require("../images/map.png");
type Blog = { alias: string, content: string, title: string };

export const Home = ({ blog }: { blog: Blog }) => <><div className="offer">
    <section>
        <h1 dangerouslySetInnerHTML={{ __html: strings.offer.title }}></h1>
        <h2>{strings.offer.description}</h2>

        <article>
            <h1>{strings.offer.middle.title}</h1>
            <h2>{strings.offer.middle.description}</h2>

            <a href="oferta" className="button">ZOBACZ PEŁNĄ OFERTĘ</a>
        </article>

        <hgroup>
            <ul id="left">
                {strings.offer.advantages.slice(0, 4).map(adv => <li key={adv}>{adv}</li>)}
            </ul>
            <ul id="right">
                {strings.offer.advantages.slice(4).map(adv => <li key={adv}>{adv}</li>)}
            </ul>
        </hgroup>
    </section>
</div>

    <div className="article">
        <section>
            <h1 dangerouslySetInnerHTML={{ __html: strings.article.title }}></h1>
            <h2>{strings.article.description}</h2>

            <article>
                <a href="{$base_url}blog/{$blog->alias}">
                    <h1>{blog.title}</h1>
                    <h2>{blog.title.slice(0, 220)}...</h2>
                </a>

                <Link to={routes.blog.route} className="button">POZOSTAŁE WPISY Z BLOGA</Link>
            </article>

            <hgroup>
                <img src={mapImage} alt="mazowsze_map" id="map" />
            </hgroup>
        </section>
    </div>

    {/* <div class="contact">
        <section>
            <div id="left">
                <h1>SKONTAKTUJ SIĘ Z NAMI</h1>
                <h2>ZAPYTAJ O WSZELKIE WĄTPLIWOŚCI</h2>
            </div>

            <div id="right">
                <h1>{$maincontent['email']}</h1>
                <h2>{$maincontent['phone']} - {$maincontent['phoneMobile']}</h2>
            </div>
        </section>
    </div>

    <div class="map">
        <section>
            <address>
                <ul>
                    {$key = preg_split('/[;]/', $maincontent['address'])}
                    {foreach $key as $value}
					<li>{$value}</li>
                    {/foreach}
			</ul>

                <img src="media/images/address_ph.png" alt="Adres siedziby PyszStudio - Andrychów" />
            </address>
        </section>
    </div> */}
</>