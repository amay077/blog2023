import React from "react";
import { Link } from "gatsby";
import dayjs from 'dayjs'
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { kebabCase } from "lodash";

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

              <div  class="columns is-mobile" style={{ fontSize: '0.9em', marginBottom: '0.2rem', marginTop: '0.5rem' }}>
                <div class="column"  style={{ display: 'flex', flexDirection: 'row', gap: '1rem', paddingTop: '0', paddingBottom: '0' }}>
                  {(post.frontmatter?.tags ?? []).map((tag) => (
                      <span>
                        <Link to={`/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                      </span>
                  ))}
                </div>
                <div class="column" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', paddingTop: '0', paddingBottom: '0' }}>
                  <span style={{ whiteSpace: 'nowrap' }}>{dayjs(post.frontmatter.date).format('YYYY/MM/DD HH:mm:ss')}</span>
                </div>
              </div>              
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
