const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const dayjs = require('dayjs');
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(
        limit: 1000
        filter: { frontmatter: { tags: { nin: ["draft"] } } }
      ) {
        totalCount
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })

    const PerPage = 20
    const pageCount = Math.ceil(result.data.allMarkdownRemark.totalCount / PerPage)
  
    for (let i = 0; i < pageCount; i++) {
      createPage({
        path: `/posts/page/${i + 1}`,
        component: path.resolve("src/pages/posts/index.js"),
        context: {
          page: i + 1,
          limit: PerPage,
          skip: i * PerPage,
        },
      })
    }    

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach((edge) => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach((tag) => {
      const tagPath = `/tags/${tag.toLowerCase()}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag: tag.toLowerCase(),
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })

    const tags = (node?.frontmatter?.tags ?? []).map(x => x.toLowerCase());
    createNodeField({
      name: `tagslower`,
      node,
      value: tags,
    })

    const dateJst = dayjs(node?.frontmatter?.date).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm:ss(+9:00)')    
    createNodeField({
      name: `date_jst`,
      node,
      value: dateJst,
    })

  }
}
