import React from 'react'
import g from 'glamorous'
import Link from 'gatsby-link'
import { rhythm } from '../utils/typography'
import Layout from '../components/layout'

const MyLink = g(Link)({
  textDecoration: 'none',
  borderBottom: '1px solid #ececec',
  color: '#000',
  transition: 'all 0.2s',
  ':hover': {
    borderBottom: '1px solid #000',
  },
})

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return null
  }
}

const List = ({ data, pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext
  const previousUrl = index - 1 === 1 ? '/' : "/" + (index - 1).toString()
  const nextUrl = "/" + (index + 1).toString()

  return (
    <Layout>
      <div>
        {group.map(({ node }) => (
          <div key={node.id}>
            <g.H3 marginBottom={rhythm(1 / 4)}>
              <MyLink
                to={`${node.fields.slug}`}
                css={{ textDecoration: `none`, borderBottom: '1px solid #ececec', color: '#000' }}
              >
                {node.frontmatter.title}
              </MyLink>
            </g.H3>
            <g.Div color="#555" marginBottom={rhythm(1 / 8)}>
              {node.frontmatter.date}
            </g.Div>
            <g.P color="#888" fontSize="16px">
              {node.excerpt}
            </g.P>
          </div>
        ))}
        <div style={{ marginTop: '64px' }}>
          <div
            className="previousLink"
            style={{ display: 'inline-block', marginRight: first ? '0' : '16px' }}
          >
            <NavLink test={first} url={previousUrl} text="← 更新" />
          </div>
          <div style={{ display: 'inline-block', marginRight: '16px', color: '#666' }}>
            第 {index} 页 / 共 {pageCount} 页
          </div>
          <div className="nextLink" style={{ display: 'inline-block' }}>
            <NavLink test={last} url={nextUrl} text="更旧 →" />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default List

// export const query = graphql`
//   query IndexQuery {
//     allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
//       totalCount
//       edges {
//         node {
//           id
//           timeToRead
//           frontmatter {
//             title
//             date(formatString: "MMM DD, YYYY")
//             tags
//           }
//           fields {
//             slug
//           }
//           excerpt
//         }
//       }
//     }
//   }
// `
