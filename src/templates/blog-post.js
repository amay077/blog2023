import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import useSiteMetadata from "../components/SiteMetadata";
import { withPrefix } from "gatsby";

// eslint-disable-next-line
const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  dateJst,
}) => {
  const PostContent = contentComponent || Content;
  const dateFormatted = dateJst; 

  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-3 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            
            <div className="post-meta">
              <div className="hashtags" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0 0.5rem' }}>
                {(tags ?? []).map((tag) => (
                    <span key={tag}>
                      <Link to={`/tags/${tag.toLowerCase()}/`}>#{tag}</Link>
                    </span>
                ))}
              </div>
              <div>
                <span style={{ whiteSpace: 'nowrap' }}>Posted on {dateFormatted}</span>
              </div>
            </div>

            <p>{description}</p>
            <PostContent content={content} />
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        excerpt={post.excerpt}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        dateJst={post.fields.date_jst}
      />
    </Layout>
  );
};


export default BlogPost;

export const Head = (arg) => {
  const { title, description, origin } = useSiteMetadata();
  const pageTitle = arg.data.markdownRemark.frontmatter.title ?? 'no title';
  const excerpt = (arg.data.markdownRemark.frontmatter.excerpt ?? description ?? 'no desc').substring(0, 100);

  return <>
    <title>{`${pageTitle} - ${title}`}</title>
    <meta name="description" content={`${excerpt}`} />

    <link
      rel="icon"
      type="image/png"
      href={`${withPrefix("/")}img/favicon-32x32.png`}
      sizes="32x32"
    />
    <link
      rel="icon"
      type="image/png"
      href={`${withPrefix("/")}img/favicon-16x16.png`}
      sizes="16x16"
    />

    <link
      rel="mask-icon"
      href={`${withPrefix("/")}img/safari-pinned-tab.svg`}
      color="#ff4400"
    />
    <meta name="theme-color" content="#fff" />

    <meta property="og:site_name" content={`${title}`} />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={`${pageTitle} - ${title}`} />
    <meta property="og:description" content={`${excerpt}`} />
    <meta property="og:image" content={`${origin}/img/og-image.jpg`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@amay077" />    

  </>
}

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 200)
      frontmatter {
        date
        title
        tags
      }
      fields {
        date_jst
      }
    }
  }
`;
