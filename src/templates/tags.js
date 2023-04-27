import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";

const TagsPage = ({ pageContext, data }) => {
  const posts = data.allMarkdownRemark.edges;
  const postLinks = posts.map((p) => {
    const post = p.node;
    const dateFormatted = post?.fields?.date_jst;
    const tags = post?.frontmatter?.tags ?? [];
    return (
      <div className="is-parent mb-4" key={post.fields.slug}>
      <article
        className={`tag-list-item tile is-child box notification ${
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
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0 0.5rem' }}>
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
      )
  });


  const tag = pageContext.tag;
  const totalCount = data.allMarkdownRemark.totalCount;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with “${tag}”`;

  return (
    <Layout>
      <section className="section">
        <div className="container content">
          <div className="columns">
            <div
              className="column is-10 is-offset-1"
              style={{ marginBottom: "6rem" }}
            >
              <h3 className="title is-size-4 is-bold-light">{tagHeader}</h3>
              <div className="">{postLinks}</div>
              <p>
                <Link to="/tags/">Browse all tags</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );    
};

export default TagsPage;

export const Head = ({ pageContext, data }) => {
  const { title, description } = data.site.siteMetadata;
  const tag = pageContext.tag;

  return <>
    <title>{`Tag:${tag} - ${title}`}</title>
    <meta name="description" content={`${description}`} />
  </>
}

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { frontmatter: {date: DESC} }
      filter: { 
        fields: { tagslower: { 
          in: [$tag] 
          nin: ["draft"]
        } }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date_jst
          }
          frontmatter {
            title
            date
            tags
          }
        }
      }
    }
  }
`;
