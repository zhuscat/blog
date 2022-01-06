import React from 'react'
import g from 'glamorous'
import Link from 'gatsby-link'
import './highlight.css'
import presets from '../utils/presets'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

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

const Layout = ({ children }) => (
  <StaticQuery
    query={query}
    render={(data) => {
      return (
        <g.Div
          margin={`0 auto`}
          maxWidth={900}
          minHeight="100vh"
          backgroundColor="#fff"
          css={{
            [presets.Mobile]: {
              padding: rhythm(0.5),
            },
            [presets.Phablet]: {
              padding: rhythm(2),
              paddingTop: rhythm(1.5),
              paddingBottom: rhythm(0.5),
            },
          }}
        >
          <Helmet>
            <title>{data.site.siteMetadata.title}</title>
            <link href="//at.alicdn.com/t/font_3123447_90wzds5gwto.css" rel="stylesheet" />
          </Helmet>
          <g.Div
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="64px"
          >
            <Link style={{ borderBottom: 'none' }} to={`/`}>
              <g.H3
                marginBottom={0}
                marginTop={0}
                display={`inline-block`}
                fontSize="20px"
                fontWeight="bold"
              >
                {data.site.siteMetadata.title.toUpperCase()}
              </g.H3>
            </Link>
            <g.Div>
              <Link
                css={{
                  textDecoration: 'none',
                  color: 'black',
                  borderBottom: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginRight: '24px',
                }}
                to={`/anniversary/`}
              >
                <i className="iconfont icon-aixin" style={{ color: '#FF3355' }} />
              </Link>
              <Link
                css={{
                  textDecoration: 'none',
                  color: 'black',
                  borderBottom: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
                to={`/about/`}
              >
                关于
              </Link>
            </g.Div>
          </g.Div>
          {children}
          <g.Div marginTop="64px" color="#aaa" fontSize="14px">
            {/* <g.Div marginBottom="16px">
              <g.Span>友情链接：</g.Span>
              <g.A href="https://kalasearch.cn" target="_blank">卡拉搜索</g.A>
            </g.Div> */}
            <g.Div>&copy; 2015 - 2022 zhuscat</g.Div>
            <g.Div>
              Hosted on <a href="//github.com">Github</a>
            </g.Div>
          </g.Div>
        </g.Div>
      )
    }}
  />
)

export default Layout
