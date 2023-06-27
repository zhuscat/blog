'use client'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const start = dayjs('2020-03-28 21:30')

function getCountInfo() {
  let seconds = dayjs().unix() - start.unix()
  const days = Math.floor(seconds / (24 * 60 * 60))
  seconds = seconds - 24 * 60 * 60 * days
  const hours = Math.floor(seconds / (60 * 60))
  seconds = seconds - 60 * 60 * hours
  const mins = Math.floor(seconds / 60)
  seconds = seconds - 60 * mins

  return [
    [`${days}`, '天'],
    [`${hours}`.padStart(2, '0'), '时'],
    [`${mins}`.padStart(2, '0'), '分'],
    [`${seconds}`.padStart(2, '0'), '秒'],
  ]
}

export function AnniversaryCountdowwn() {
  const [countInfo, setCountInfo] = useState([
    ['', '天'],
    ['', '小时'],
    ['', '分钟'],
    ['', '秒'],
  ])

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
    setCountInfo(getCountInfo())

    return () => {
      valid = false
    }
  }, [])

  return (
    <div className="flex items-center">
      {countInfo.map((item) => {
        return (
          <>
            <div className="min-w-[40px] h-[40px] p-[8px] bg-[rgb(32,36,38)] rounded-[8px] text-white text-[18px] flex items-center justify-center">
              {item[0]}
            </div>
            <div className="px-[8px] text-[18px]">{item[1]}</div>
          </>
        )
      })}
    </div>
  )
}
