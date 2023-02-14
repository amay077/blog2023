import * as React from "react";

import Layout from "../../components/Layout";
import BlogRoll2 from "../../components/BlogRoll2";
import Pagination from "../../components/Pagination";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";

export const BlogIndexPage = ({ data, pageContext }) => {
  const { edges: posts } = data.allMarkdownRemark
  const { totalCount } = data.allMarkdownRemark

  return (
    <Layout>
      <div
        className="full-width-image-container margin-top-0"
        style={{
          backgroundImage: `url('/img/blog-index.jpg')`,
        }}
      >
        <h1
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
            backgroundColor: "#f40",
            color: "white",
            padding: "1rem",
          }}
        >
          Latest Posts
        </h1>
      </div>
      <section className="">
        <div className="container">
          <div className="content">
            <BlogRoll2 posts={posts} />
            <Pagination page={pageContext.page ?? 1} size={20} totalCount={totalCount} />
          </div>
        </div>
      </section>
    </Layout>
  )
};
export default BlogIndexPage;

BlogIndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};


export const pageQuery = graphql`
  query($limit: Int = 20, $skip: Int = 0)  {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      skip: $skip
      limit: $limit
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date
            tags
            featuredpost
            featuredimage {
              childImageSharp {
                gatsbyImageData(
                  width: 120
                  quality: 100
                  layout: CONSTRAINED
                )

              }
            }
          }
        }
      }
    }    
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        heading
        subheading
        mainpitch {
          title
          description
        }
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                gatsbyImageData(width: 240, quality: 64, layout: CONSTRAINED)
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`;
