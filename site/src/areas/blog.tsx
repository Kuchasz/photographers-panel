import * as React from "react";
import { BlogEntry, getBlog } from "../../../api/get-blog";

type BlogProps = { initialState?: BlogEntry; alias: string };
type BlogState = { blog?: BlogEntry };

export class Blog extends React.Component<BlogProps, BlogState> {
    state = this.props.initialState !== undefined ? { blog: this.props.initialState } : { blog: undefined };

    componentDidMount() {
        if (this.state.blog === undefined) {
            getBlog(this.props.alias).then(blog => this.setState({ blog }));
        }
    }

    render() {
        if (this.state.blog === undefined) return null;
        return (
            <div className="blog">
                <section>
                    <article>
                        <h1>
                            <sup>
                                <small>{this.state.blog.date}</small>
                            </sup>
                            <br />
                            {this.state.blog.title}
                        </h1>
                        <h2>{this.state.blog.content}</h2>
                        <span>
                            Świetnie bawiłeś się na tym weselu? Znasz Młodą Parę? Lub może po prostu podobają Ci się
                            zdjęcia, kliknij:
                        </span>
                        <div
                            className="fb-share-button"
                            data-href="http://{$smarty.server.HTTP_HOST}{$smarty.server.REQUEST_URI}"
                            data-layout="button_count"
                        ></div>
                        <br />
                        <br />

                        {this.state.blog.photos.map(p => (
                            <img key={p.photoUrl} src={p.photoUrl} alt={p.altText} />
                        ))}
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