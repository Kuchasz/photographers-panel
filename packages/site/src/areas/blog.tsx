import * as api from "@pp/api/dist/site/blog";
import * as React from "react";
import facebookIcon from "../images/facebook.svg";
import { Headers } from "../components/headers";
import { strings } from "../resources";

type BlogProps = { initialState?: api.Blog; alias: string };
type BlogState = { blog?: api.Blog };

export class Blog extends React.Component<BlogProps, BlogState> {
    state = this.props.initialState !== undefined ? { blog: this.props.initialState } : { blog: undefined };

    componentDidMount() {
        if (this.state.blog === undefined) {
            api.getBlog(this.props.alias).then((blog) => this.setState({ blog }));
        }
    }

    render() {
        if (this.state.blog === undefined) return null;
        const location = (global as any).window.location;

        return (
            <div className="blog">
                <Headers title={`${this.state.blog.title} (blog)`} />
                <section>
                    <article className="show">
                        <h1>{this.state.blog.title}</h1>
                        <h2>{this.state.blog.content}</h2>
                        <span>
                            {strings.blog.shareMessage}
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${location}`}>
                                <img style={{filter: 'invert(1)'}} src={facebookIcon} />
                            </a>
                        </span>
                        <br />
                        <br />
                        <div className="photos">
                            {this.state.blog.assets.map((p) => (
                                <img key={p.url} src={p.url} alt={p.alt} loading="lazy" />
                            ))}
                        </div>
                    </article>
                </section>
                <div id="fb-root"></div>
            </div>
        );
    }
}

{
    /* <div class="blog">
    <section>
        {if $smarty.post.title = $blog->title}
        <article>
            <h1 style="display: inline"><sup><small>{$blog->date}</small></sup><br/>{$blog->title}</h1>
            <h2 style="margin-bottom: 50px">{$blog->content}</h2>
            <span style="font-size: 14px">Świetnie bawiłeś się na tym weselu? Znasz Młodą Parę? Lub może po prostu podobają Ci się zdjęcia, kliknij:</span>
            <div class="fb-share-button"
              data-href="http://{$smarty.server.HTTP_HOST}{$smarty.server.REQUEST_URI}"
              data-layout="button_count">
            </div>
            </br></br>
            <span style="font-size: 14px">Byłeś uczestnikiem tego wesela? Podziel się wrażeniami w komentarzach poniżej.</span></br></br>
            <section id="comments"></section>
            {foreach $blog->blogentryphoto->find_all() as $photo}
                <center><img src="{$base_url}media/images/blog/{$blog->date}/{$photo->photourl}" alt="{$photo->alttext}" style="margin-top: 20px; margin-bottom: 40px"></center>
            {/foreach}
        </article>
        {else}
            <script type="text/javascript">
                location.replace('{$base_url}');
            </script>
        {/if}
    </section>
    <div id="fb-root"></div>
    <script>
    {literal}
      var defaultComments =
        {/literal}
        {$comments}
        {literal};
    {/literal}
    </script>
</div> */
}
