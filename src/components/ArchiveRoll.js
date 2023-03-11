import React from "react";
import { Link } from "gatsby";
import dayjs from 'dayjs'
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export const ArchiveRoll = ({ posts }) => {

  return (
  <div className="columns is-multiline">
    {(posts ?? []).map(({ node: post }) => { 
      const dateFormatted = dayjs(post?.frontmatter?.date).format('YYYY/MM/DD HH:mm:ss(+9:00)')
      const tags = post.frontmatter?.tags ?? [];

      return (
      <div className="is-parent column is-6" key={post.id}>
        <article
          className={`blog-list-item tile is-child box notification ${
            post.frontmatter.featuredpost ? 'is-featured' : ''
          }`}
        >
          <header>
            <div>
              <Link
                className="title has-text-primary is-size-5"
                to={post.fields.slug}
              >
                {post.frontmatter.title}
              </Link>

              <div className="post-meta" style={{marginTop: '5px'}}>
                <div className="hashtags" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0 0.5rem' }}>
                  {(tags ?? []).map((tag) => (
                      <span key={tag}>
                        <Link to={`/tags/${tag.toLowerCase()}/`}>#{tag}</Link>
                      </span>
                  ))}
                </div>
                <div>
                  <span style={{ whiteSpace: 'nowrap' }}>{dateFormatted}</span>
                </div>
              </div>              
           
            </div>
          </header>
        </article>
        </div>
      )})}
  </div>)
};



export default ArchiveRoll;