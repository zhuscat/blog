import React from 'react'
import Tag from '../components/Tag'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import { Helmet } from 'react-helmet'
import Waline from '../components/Waline'

const BlogPost = ({ data }) => {
  const post = data.markdownRemark

  // TODO: 直接在 onCreateNode 的时候生成信息比较好
  let identifier = post.fields.slug

  if (identifier[0] === '/') {
    identifier = identifier.slice(1)
  }

  if (identifier[identifier.length - 1] === '/') {
    identifier = identifier.slice(0, -1)
  }

  return (
    <Layout>
      <Helmet>
        <title>
          {post.frontmatter.title} - {data.site.siteMetadata.title}
        </title>
      </Helmet>
      <div>
        <h1 style={{ color: 'black', fontWeight: 'bold', marginBottom: 0, marginTop: 0 }}>
          {post.frontmatter.title}
        </h1>
        <div style={{ fontSize: 'smaller' }}>{post.frontmatter.date}</div>
        <div style={{ marginTop: '112px' }} dangerouslySetInnerHTML={{ __html: post.html }} />
        <div>
          {post.frontmatter.tags &&
            post.frontmatter.tags.map((name) => <Tag key={name} name={name} />)}
        </div>
        <div
          style={{
            marginTop: '32px',
            marginBottom: '32px',
            borderRadius: '4px',
            backgroundColor: '#f8fbfc',
            padding: '16px',
          }}
        >
          <a
            rel="license"
            style={{ borderBottom: 'none' }}
            href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
          >
            <img
              alt="知识共享许可协议"
              style={{ borderWidth: 0 }}
              src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
            />
          </a>
          <br />
          本作品采用
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
            知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议
          </a>
          进行许可。
        </div>
        <Waline />
      </div>
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
      fields {
        slug
      }
    }
  }
`
