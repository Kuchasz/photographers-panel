import * as React from 'react';
import { BlogListItem, getBlogsList } from '@pp/api/dist/site/blog';
import { Link } from 'react-router';

type BlogsProps = { initialState?: BlogListItem[] };

export const Blogs = ({ initialState }: BlogsProps) => {
    const [blogs, setBlogs] = React.useState<BlogListItem[] | undefined>(initialState);

    React.useEffect(() => {
        if (blogs === undefined) {
            getBlogsList().then(setBlogs);
        }
    }, []);

    return (
        <>
            <div className="blog">
                <section>
                    <article>
                        {blogs
                            ? blogs.map((blog) => (
                                <Link key={blog.alias} to={'/blog/' + blog.alias}>
                                    <div className="thumb">
                                        <div className="blog-text">
                                            <div className="blog-title">{blog.title}</div>
                                        </div>
                                        <img src={blog.photoUrl} alt={blog.photoAlt}></img>
                                    </div>
                                </Link>
                            ))
                            : null}
                    </article>
                </section>
            </div>
        </>
    );
};
