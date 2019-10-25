import * as React from "react";
import { BlogListItem, getBlogsList } from "../../../api/get-blogs-list";

type BlogsProps = { initialState?: BlogListItem[] };
type BlogsState = { blogs?: BlogListItem[] };

export class Blogs extends React.Component<BlogsProps, BlogsState> {
    state = this.props.initialState !== undefined ? { blogs: this.props.initialState } : { blogs: undefined };

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
                            {this.state.blogs
                                ? this.state.blogs.map(blog => (
                                      <a key={blog.alias} href={"/blog/" + blog.alias}>
                                          <div style={{ backgroundImage: `url(${blog.photoUrl})` }}>
                                              <div className="hover-bg">{blog.title}</div>
                                              <div className="blog-date">{blog.date}</div>
                                          </div>
                                      </a>
                                  ))
                                : null}
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
