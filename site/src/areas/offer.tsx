import React from "react";
import { strings } from "../resources";
import { first } from "../../../utils/array";
import { OfferEntry, getOffer } from "../../../api/offer";

const getImageBackgroundStyle = (url: string) => {
    return {
        backgroundImage: `url(${url})`
    };
};

type Offer = { title: string; photos: string[]; description: string };
type OfferProps = { alias: string };

export const Offer = ({ alias }: OfferProps) => {
    const [offer, setOffer] = React.useState({} as OfferEntry);

    React.useEffect(() => {
        getOffer(alias).then(setOffer);
    }, []);

    return (
        <div className="sub_sub offer">
            <section>
                <article>
                    <h1>{offer.title}</h1>

                    {offer.photos?.length > 0 ? (
                        <div className="slides">
                            {offer.photos.map(p => (
                                <div className="slide" key={p.url} style={getImageBackgroundStyle(p.url)}></div>
                                // <img key={p.url} src={p.url} alt={p.altText}></img>
                            ))}
                        </div>
                    ) : null}

                    <div className="content" dangerouslySetInnerHTML={{ __html: offer.description }}></div>
                </article>
            </section>
        </div>
    );
};

{
    /* <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="{$base_url}media/js/jquery.slides.min.js"></script>
<script>
    $(function() {
      $('#slides').slidesjs({
        play: {
          active: true,
          auto: true,
          interval: 10000,
          swap: true
        }
      });
    });
  </script> */
}
