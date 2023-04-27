import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../../components/Layout";
import { withPrefix } from "gatsby";

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <Layout>
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div
            className="column is-10 is-offset-1"
            style={{ marginBottom: "6rem" }}
          >
            <h1 className="title is-size-2 is-bold-light">Tags</h1>
            <ul className="taglist">
              {group.map((tag) => (
                <li key={tag.fieldValue}>
                  <Link to={`/tags/${tag.fieldValue.toLowerCase()}/`}>
                    {tag.fieldValue} ({tag.totalCount})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default TagsPage;

export const Head = ({ data }) => {
  const { title, description } = data.site.siteMetadata;
  return <>
    <title>{`Tags - ${title}`}</title>
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
  </>
}

export const tagPageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      filter: { fields: { tagslower: { nin: ["draft"] } } }
    ) {
      group(field: {fields: {tagslower: SELECT}}) {
        fieldValue
        totalCount
      }
    }
  }
`;
