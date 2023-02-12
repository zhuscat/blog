const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const createPaginatedPages = require('gatsby-paginate')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`{
  allMarkdownRemark(
    sort: {frontmatter: {date: DESC}}
    filter: {fields: {slug: {regex: "/^/posts//"}}}
  ) {
    totalCount
    edges {
      node {
        id
        timeToRead
        frontmatter {
          title
          date(formatString: "MMM DD, YYYY")
          tags
        }
        fields {
          slug
        }
        excerpt(truncate: true, format: PLAIN, pruneLength: 100)
      }
    }
  }
}`).then(result => {
      // 分页
      createPaginatedPages({
        edges: result.data.allMarkdownRemark.edges,
        createPage: createPage,
        pageTemplate: 'src/templates/index.js',
        pageLength: 10, // This is optional and defaults to 10 if not used
        pathPrefix: '', // This is optional and defaults to an empty string if not used
        context: {}, // This is optional and defaults to an empty object if not used
      })

      // 博文页
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        const postPath = path.resolve(node.fields.slug)

        createPage({
          path: postPath,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  });
}
