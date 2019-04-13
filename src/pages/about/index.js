import React from 'react'
import Button from '../../components/Button'
import Layout from '../../components/layout'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'

const languages = [{ key: 'zh-cmn', name: '普通话' }, { key: 'zh-wuu', name: '吴语-温州话' }]

export default class About extends React.Component {
  state = {
    lang: 'zh-cmn',
  }

  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    let post = null

    for (let i = 0; i < posts.length; i++) {
      const { node } = posts[i]
      if (node.frontmatter.lang === this.state.lang) {
        post = node
        break
      }
    }

    return (
      <Layout>
        <Helmet>
          <title>关于 - {this.props.data.site.siteMetadata.title}</title>
        </Helmet>
        <div>
          <div>
            {languages.map(item => (
              <Button
                key={item.key}
                active={item.key === this.state.lang}
                onClick={() => this.setState({ lang: item.key })}
              >
                {item.name}
              </Button>
            ))}
          </div>
          <div>
            <h1 style={{ color: 'black', fontWeight: 'bold', marginBottom: 0 }}>
              {post.frontmatter.title}
            </h1>
            <div style={{ fontSize: 'smaller' }}>{post.frontmatter.date}</div>
            <div style={{ marginTop: '112px' }} dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </div>
      </Layout>
    )
  }
}

export const query = graphql`
  query AboutMeQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { slug: { regex: "/^/pages/about//" } } }
    ) {
      edges {
        node {
          html
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            lang
          }
          fields {
            slug
          }
          excerpt(truncate: true, format: PLAIN)
        }
      }
    }
  }
`
