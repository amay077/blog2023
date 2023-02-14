import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import useSiteMetadata from "../components/SiteMetadata";
import dayjs from 'dayjs'
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

// eslint-disable-next-line
export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
  date,
}) => {
  const PostContent = contentComponent || Content;
  const dateFormatted = dayjs(date).format('YYYY/MM/DD HH:mm:ss(+9:00)')

  return (
    <section className="section">
      {helmet || ""}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            
            <div class="columns is-mobile">
              <div class="column"  style={{ display: 'flex', flexDirection: 'row', gap: '1rem', paddingTop: '0', paddingBottom: '0' }}>
                {(tags ?? []).map((tag) => (
                    <span>
                      <Link to={`/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                    </span>
                ))}
              </div>
              <div class="column" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', paddingTop: '0', paddingBottom: '0' }}>
                <span>Posted on {dateFormatted}</span>
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

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
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
        helmet={
          <Helmet titleTemplate={`%s | ${siteTitle}`}>
            <title>{`${post.frontmatter.title}`}</title>
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

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
