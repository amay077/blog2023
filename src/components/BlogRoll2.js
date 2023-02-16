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
    {(posts ?? []).map(({ node: post }) => { 
      const dateFormatted = dayjs(post.date).format('YYYY/MM/DD HH:mm:ss(+9:00)')
      const tags = post.frontmatter?.tags;

      return (
      <div className="is-parent column is-6" key={post.id}>
        <article
          className={`blog-list-item tile is-child box notification ${
            post.frontmatter.featuredpost ? 'is-featured' : ''
          }`}
        >
          <header>
            <p>
              <Link
                className="title has-text-primary is-size-4"
                to={post.fields.slug}
              >
                {post.frontmatter.title}
              </Link>

              <div class="post-meta" style={{marginTop: '5px'}}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0 0.5rem' }}>
                  {(tags ?? []).map((tag) => (
                      <span>
                        <Link to={`/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                      </span>
                  ))}
                </div>
                <div>
                  <span style={{ whiteSpace: 'nowrap' }}>{dateFormatted}</span>
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
      )})}
  </div>)
};



export default BlogRoll2;
