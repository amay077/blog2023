import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../../components/Layout";

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
