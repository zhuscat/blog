import React from 'react'
import g from 'glamorous'
import { css } from 'glamor'
import Link from 'gatsby-link'
import './highlight.css'
import presets from '../utils/presets'
import { Helmet } from 'react-helmet'

import { rhythm } from '../utils/typography'

export default ({ children, data }) => (
  <g.Div
    margin={`0 auto`}
    maxWidth={900}
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
    </Helmet>
    <g.Div display="flex" justifyContent="space-between" alignItems="center" marginBottom="64px">
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
    {children()}
    <g.Div marginTop="64px" color="#aaa" fontSize="14px">
      <g.Div>&copy; 2015 - 2018 zhuscat</g.Div>
      <g.Div>
        Hosted on <a href="//github.com">Github</a> and <a href="//coding.net">Coding.net</a>
      </g.Div>
      <g.A
        href="//coding.net"
        css={{
          borderBottom: 'none',
          marginLeft: '-18px',
          ':hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <g.Img
          marginBottom="0"
          src="https://dn-coding-net-production-static.qbox.me/static/d028a9456b15526cc64eba6bd36012a8.svg"
        />
      </g.A>
    </g.Div>
  </g.Div>
)

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
