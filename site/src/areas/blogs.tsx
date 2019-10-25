import * as React from "react";
import { BlogListItem, getBlogsList } from "../../../api/get-blogs-list";
import { Link } from "react-router-dom";

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
                                      <Link key={blog.alias} to={"/blog/" + blog.alias}>
                                          <div style={{ backgroundImage: `url(${blog.photoUrl})` }}>
                                              <div className="hover-bg">{blog.title}</div>
                                              <div className="blog-date">{blog.date}</div>
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
