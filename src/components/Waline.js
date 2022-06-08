import React, { useRef } from 'react'
import { init } from '@waline/client'
import '@waline/client/dist/waline.css'
import { useEffect } from 'react'

export default function Waline() {
  const instanceRef = useRef()

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update()
    } else {
      const instance = init({
        el: '#waline',
        serverURL: 'https://waline-ft5fp0okw-zhuscat.vercel.app',
      })
      instanceRef.current = instance
    }

    return () => {
      instanceRef.current.destroy()
    }
  }, [])
  return <div id="waline" />
}
