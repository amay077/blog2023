import React from "react";
// import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import useSiteMetadata from "../components/SiteMetadata";
// import dayjs from 'dayjs'
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(timezone);
// dayjs.extend(utc);

// eslint-disable-next-line
export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  date,
}) => {
  const PostContent = contentComponent || Content;
  // const dateFormatted = dayjs(date).format('YYYY/MM/DD HH:mm:ss(+9:00)-')
  const dateFormatted = date;

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

// BlogPostTemplate.propTypes = {
//   content: PropTypes.node.isRequired,
//   contentComponent: PropTypes.func,
//   description: PropTypes.string,
//   title: PropTypes.string,
// };

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
      />
    </Layout>
  );
};

// BlogPost.propTypes = {
//   data: PropTypes.shape({
//     markdownRemark: PropTypes.object,
//   }),
// };

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 200)
      frontmatter {
        date
        title
        description
        tags
      }
    }
  }
`;
