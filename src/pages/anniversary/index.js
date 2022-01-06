import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/layout'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import dayjs from 'dayjs'
import g from 'glamorous'

const start = dayjs('2020-03-28 21:30')

function getCountInfo() {
  let seconds = dayjs().unix() - start.unix()
  const days = Math.floor(seconds / (24 * 60 * 60))
  seconds = seconds - 24 * 60 * 60 * days
  const hours = Math.floor(seconds / (60 * 60))
  seconds = seconds - 60 * 60 * hours
  const mins = Math.floor(seconds / 60)
  seconds = seconds - 60 * mins

  return {
    days: `${days}`,
    hours: `${hours}`.padStart(2, 0),
    mins: `${mins}`.padStart(2, 0),
    seconds: `${seconds}`.padStart(2, 0),
  }
}

function Unit(props) {
  return <g.Div css={{ paddingLeft: 8, paddingRight: 8, fontSize: 18 }}>{props.children}</g.Div>
}

function UnitBox(props) {
  return (
    <g.Div
      css={{
        minWidth: 40,
        height: 40,
        padding: 8,
        backgroundColor: 'rgb(32, 36, 38)',
        borderRadius: 8,
        boxSizing: 'border-box',
        color: '#fff',
        fontSize: 18,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {props.children}
    </g.Div>
  )
}

export default function Anniversary(props) {
  const [countInfo, setCountInfo] = useState(getCountInfo())

  useEffect(() => {
    let valid = true

    const tick = () => {
      if (valid) {
        setTimeout(() => {
          setCountInfo(getCountInfo())
          tick()
        }, 1000)
      }
    }

    tick()

    return () => {
      valid = false
    }
  }, [])

  return (
    <Layout>
      <Helmet>
        <title>纪念日 - {props.data.site.siteMetadata.title}</title>
      </Helmet>
      <div
        style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}
      >
        <g.Img
          src="https://s2.loli.net/2022/01/07/skOiQIfT7xdXPFR.jpg"
          css={{ width: 200, height: 200, borderRadius: 8 }}
        />
        <g.Div css={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
          Z <i className="iconfont icon-aixin" style={{ color: '#FF3355', fontSize: 32 }} /> C
        </g.Div>
        <g.Div css={{ marginBottom: 16, fontSize: 18 }}>已经过了</g.Div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UnitBox>{countInfo.days}</UnitBox>
          <Unit>天</Unit>
          <UnitBox>{countInfo.hours}</UnitBox>
          <Unit>时</Unit>
          <UnitBox>{countInfo.mins}</UnitBox>
          <Unit>分</Unit>
          <UnitBox>{countInfo.seconds}</UnitBox>
          <Unit>秒</Unit>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query AnniversaryQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
