const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const createPaginatedPages = require("gatsby-paginate");


exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `posts` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC },
          filter: {
            id: {
              regex: "/\/posts\//"
            }
          }
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
              excerpt
            }
          }
        }
      }
    `).then(result => {
      // 分页
      createPaginatedPages({
        edges: result.data.allMarkdownRemark.edges,
        createPage: createPage,
        pageTemplate: "src/templates/index.js",
        pageLength: 10, // This is optional and defaults to 10 if not used
        pathPrefix: "", // This is optional and defaults to an empty string if not used
        context: {} // This is optional and defaults to an empty object if not used
      });

      // 博文页
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        const postPath = path.join('/posts', node.fields.slug)

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
  })
};
