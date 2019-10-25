import * as React from "react";
import { BlogListItem, getBlogsList } from "../../../api/get-blogs-list";

type BlogsProps = {};
type BlogsState = { blogs: BlogListItem[] };

export class Blogs extends React.Component<BlogsProps, BlogsState> {

    componentDidMount() {
        if (this.state.blogs === undefined) {
            getBlogsList().then(blogs => this.setState({ blogs }));
        }
    }

    render() {
        return (
            <>
                <div className="blog">
                    <section>
                        <article>
                            {this.state.blogs.map(blog => (
                                <a href="{$smarty.server.REQUEST_URI}/{$blo->alias}">
                                    {/* <div style="background-image: url('{$base_url}media/images/blog/{$blo->date}/{$blo->blogentryphoto->find()->photourl}')"> */}
                                    <div>
                                        <div className="hover-bg">{blog.title}</div>
                                        <div className="blog-date">{blog.date}</div>
                                    </div>
                                </a>
                            ))}
                        </article>
                    </section>
                </div>
            </>
        );
    }
}

{
    /* <div class="blog">
    <section>
        <article>
        {foreach $blog as $blo}
        <a href="{$smarty.server.REQUEST_URI}/{$blo->alias}">
        <div style="background-image: url('{$base_url}media/images/blog/{$blo->date}/{$blo->blogentryphoto->find()->photourl}')">
          <div class="hover-bg">{$blo->title}</div>
          <div class="blog-date">{$blo->date}</div>
        </div>
      </a>
        <!--
            <h1><sup><small>{$blo->date}</small></sup><br/>{$blo->title}</h1>
            <h2>{$blo->content|truncate:140:"...":'UTF-8'}</h2>
        </a> -->
        {/foreach}
        </article>
    </section>
</div> */
}
