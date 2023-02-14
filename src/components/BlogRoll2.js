import React from "react";
import { Link } from "gatsby";
import dayjs from 'dayjs'
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export const BlogRoll2 = ({ posts }) => {
  return (
  <div className="columns is-multiline">
    {posts && posts.map(({ node: post }) => (
      <div className="is-parent column is-6" key={post.id}>
        <article
          className={`blog-list-item tile is-child box notification ${
            post.frontmatter.featuredpost ? 'is-featured' : ''
          }`}
        >
          <header>
            <p className="post-meta">
              <Link
                className="title has-text-primary is-size-4"
                to={post.fields.slug}
              >
                {post.frontmatter.title}
              </Link>
              <span></span>
              <span className="subtitle is-block">
                {dayjs(post.frontmatter.date).format('YYYY/MM/DD HH:mm:ss')}
              </span>
            </p>
          </header>
          <p>
            {post.excerpt}
            <br />
            <br />
            <Link className="button" to={post.fields.slug}>
              Keep Reading →
            </Link>
          </p>
        </article>
        </div>
      ))}
  </div>)
};



export default BlogRoll2;
