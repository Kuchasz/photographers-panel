import React from "react";
import { strings } from "../resources";
import { first } from "../../../utils/array";
import { OfferEntry, getOffer } from "../../../api/offer";

type Offer = { title: string; photos: string[]; description: string };
type OfferProps = { alias: string };

export const Offer = ({ alias }: OfferProps) => {
    // const offer = first(strings.offer.tariffs, item => item.alias === alias);

    const [offer, setOffer] = React.useState({} as OfferEntry);

    React.useEffect(() => {
        getOffer(alias).then(setOffer);
    });

    return (
        <div className="sub_sub">
            <section>
                <article>
                    <h1>{offer.title}</h1>

                    <div id="slides" style={{ margin: "40px 0 40px 0" }}>
                        {/* {foreach $offer->offerphoto->find_all() as $photo} */}
                        {/* <img src="{$base_url}media/images/offers/photo/{$photo->photourl}" alt="{$photo->alttext}"> */}
                        {/* {/foreach} */}
                    </div>

                    <h2 dangerouslySetInnerHTML={{__html: offer.description}}></h2>
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
