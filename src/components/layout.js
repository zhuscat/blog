import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby-link'
import './highlight.css'
import presets from '../utils/presets'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

import { rhythm } from '../utils/typography'

const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Container = styled.div`
  margin: 0 auto;
  max-width: 900px;
  min-height: 100vh;
  background-color: #fff;
  ${presets.Mobile} {
    padding: ${rhythm(0.5)};
  }

  ${presets.Phablet} {
    padding: ${rhythm(2)};
    padding-top: ${rhythm(1.5)};
    padding-bottom: ${rhythm(0.5)};
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64px;
`

const Logo = styled.h3`
  margin-bottom: 0;
  margin-top: 0;
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
`

const HeartIconLink = styled(Link)`
  text-decoration: none;
  color: black;
  border-bottom: none;
  font-size: 16px;
  font-weight: bold;
  margin-right: 24px;
`

const AboutLink = styled(Link)`
  text-decoration: none;
  color: black;
  border-bottom: none;
  font-size: 16px;
  font-weight: bold;
`

const Footer = styled.div`
  margin-top: 64px;
  color: #aaa;
  font-size: 14px;
`

const Layout = ({ children }) => {
  const data = useStaticQuery(query)

  return (
    <Container>
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <link href="//at.alicdn.com/t/font_3123447_90wzds5gwto.css" rel="stylesheet" />
      </Helmet>
      <Header>
        <Link style={{ borderBottom: 'none' }} to={`/`}>
          <Logo>{data.site.siteMetadata.title.toUpperCase()}</Logo>
        </Link>
        <div>
          <HeartIconLink to={`/anniversary/`}>
            <i className="iconfont icon-aixin" style={{ color: '#FF3355' }} />
          </HeartIconLink>
          <AboutLink to={`/about/`}>关于</AboutLink>
        </div>
      </Header>
      {children}
      <Footer>
        <div>&copy; 2015 - 2022 zhuscat</div>
        <div>
          Hosted on <a href="//vercel.com/">Vercel</a>
        </div>
      </Footer>
    </Container>
  )
}

export default Layout
