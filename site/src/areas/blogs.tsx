import * as React from 'react';
import { BlogListItem, getBlogsList } from '@pp/api/site/blog';
import { Link } from 'react-router-dom';

type BlogsProps = { initialState?: BlogListItem[] };
type BlogsState = { blogs?: BlogListItem[] };
const options = { year: 'numeric' as 'numeric', month: 'long' as 'long', day: 'numeric' as 'numeric' };

export class Blogs extends React.Component<BlogsProps, BlogsState> {
    state = this.props.initialState !== undefined ? { blogs: this.props.initialState } : { blogs: undefined };

    componentDidMount() {
        if (this.state.blogs === undefined) {
            getBlogsList().then((blogs) => this.setState({ blogs }));
        }
    }

    render() {
        return (
            <>
                <div className="blog">
                    <section>
                        <article>
                            {this.state.blogs
                                ? this.state.blogs.map((blog) => (
                                      <Link key={blog.alias} to={'/blog/' + blog.alias}>
                                          <div className="thumb">
                                              <img src={blog.photoUrl} alt={blog.photoAlt}></img>
                                          </div>
                                          <div className="blog-text">
                                              <div className="blog-title">{blog.title}</div>
                                              <div className="blog-date">
                                                  {new Date(blog.date).toLocaleDateString(undefined, options)}
                                              </div>
                                              <div className="blog-content">{blog.content}</div>
                                          </div>
                                      </Link>
                                  ))
                                : null}
                        </article>
                    </section>
                </div>
            </>
        );
    }
}
