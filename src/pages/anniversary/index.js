import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import dayjs from 'dayjs'

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

const Unit = styled.div`
  padding-left: 8px;
  padding-right: 8px;
  font-size: 18px;
`

const UnitBox = styled.div`
  min-width: 40px;
  height: 40px;
  padding: 8px;
  background-color: rgb(32, 36, 38);
  border-radius: 8px;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

const MainImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 8px;
`

const Names = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
`

const Title = styled.div`
  margin-bottom: 16px;
  font-size: 18px;
`

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
      <Container>
        <MainImage src="https://s2.loli.net/2022/01/07/skOiQIfT7xdXPFR.jpg" />
        <Names>
          Z <i className="iconfont icon-aixin" style={{ color: '#FF3355', fontSize: 32 }} /> C
        </Names>
        <Title>已经过了</Title>
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
      </Container>
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
