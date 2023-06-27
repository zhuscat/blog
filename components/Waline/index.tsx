'use client'

import { type WalineInstance, init } from '@waline/client'
import '@waline/client/dist/waline.css'
import React, { useRef, useEffect } from 'react'

export function Waline() {
  const instanceRef = useRef<WalineInstance | null>(null)
  const containerRef = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (containerRef) {
      instanceRef.current = init({
        el: containerRef.current,
        serverURL: 'https://waline-ft5fp0okw-zhuscat.vercel.app',
      })

      return () => instanceRef.current?.destroy()
    }
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      style={
        {
          '--waline-theme-color': '#0ea5e9',
          '--waline-active-color': '#0284c7',
        } as React.CSSProperties
      }
    />
  )
}
