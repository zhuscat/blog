import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby-link'
import { rhythm } from '../utils/typography'
import Layout from '../components/layout'

const MyLink = styled(Link)({
  textDecoration: 'none',
  borderBottom: '1px solid #ececec',
  color: '#000',
  transition: 'all 0.2s',
  ':hover': {
    borderBottom: '1px solid #000',
  },
})

const Title = styled.h3({
  marginBottom: rhythm(1 / 4),
})

const PostDate = styled.div({
  color: '#555',
  marginBottom: rhythm(1 / 8),
})

const Excerpt = styled.p({
  color: '#888',
  fontSize: '16px',
})

const NavLink = (props) => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return null
  }
}

const List = ({ data, pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext
  const previousUrl = index - 1 === 1 ? '/' : '/' + (index - 1).toString()
  const nextUrl = '/' + (index + 1).toString()

  return (
    <Layout>
      <div>
        {group.map(({ node }) => (
          <div key={node.id}>
            <Title>
              <MyLink to={`${node.fields.slug}`}>{node.frontmatter.title}</MyLink>
            </Title>
            <PostDate>{node.frontmatter.date}</PostDate>
            <Excerpt>{node.excerpt}</Excerpt>
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
