import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";
import BlogRoll from "../components/BlogRoll";
import FullWidthImage from "../components/FullWidthImage";
import useSiteMetadata from "../components/SiteMetadata";
import { withPrefix } from "gatsby";

// eslint-disable-next-line
const IndexPageTemplate = ({
  image,
  title,
  subheading,
  posts,
}) => {
  const heroImage = getImage(image) || image;

  return (
    <div>
      <FullWidthImage img={heroImage} title={title} subheading={subheading} />
      <section className="section--gradient">
        <div className="container">
          <div className="">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="content">
                  <div className="column is-12">
                    <BlogRoll posts={posts} />
                    <div className="column is-12 has-text-centered">
                      <Link to="/posts">
                        <button className="button is-primary">
                          Read more
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  const { edges: posts } = data.allMarkdownRemark

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        subheading={frontmatter.subheading}
        posts={posts}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

export const Head = (arg) => {
  const { title, description, origin } = useSiteMetadata();

  return <>
    <title>{`${title}`}</title>
    <meta name="description" content={`${description}`} />

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
    <meta property="og:title" content={`${title}`} />
    <meta property="og:description" content={`${description}`} />
    <meta property="og:image" content={`${origin}/img/og-image.jpg`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@amay077" />    

  </>
}

export const pageQuery = graphql`
  query IndexPageTemplate {
    allMarkdownRemark(
      sort: { frontmatter: {date: DESC} }
      filter: { 
        frontmatter: { templateKey: { eq: "blog-post" } } 
        fields: { tagslower: { nin: ["draft"] } }
      }
      limit: 16
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          fields {
            slug
            date_jst
          }
          frontmatter {
            title
            templateKey
            date
            tags
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
        subheading
      }
    }
  }
`;
