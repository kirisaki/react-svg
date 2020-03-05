/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Global, jsx, css, keyframes } from '@emotion/core'
import { newRandGen, randNext } from 'fn-mt'

const globalStyle = css`
  * {
      padding: 0;
      margin: 0;
    }
html {
      background-color: #333;
      color: #eee;
    }
a {
      color: #eee;
      text-decoration: none;
}
a:hover {
      background-color: #eee;
      color: #333
}
`

export const App: React.FC = () => {
  const [screen, setScreen] = useState({width: -1, height: -1})
  const prev = useRef({width: -2, height: -2})
  const [angle, setAngle] = useState(0)
  useEffect(() => {
    const resizeObserver = new ResizeObserver(es => {
      for (let e of es){
        if (e.target.id === 'maincontainer'){
          const width = e.target.clientWidth
          const height= e.target.clientHeight
          if(prev.current.width !== width || prev.current.height !== height){
            setScreen({width, height})
          }
        }
      }
    })
    const target = document.getElementById('maincontainer')
    resizeObserver.observe(target)
    return () => resizeObserver.unobserve(target)
  })
  const [active, setActive] = useState(true)
  useEffect(() => {
    if(active){
      setTimeout(() => {
        setAngle((angle + 1) % 360)
      }, 1)
    }
  })
  const arc = convert(screen.width/2, screen.height/2, 70, 1, angle)
  const arcStr = `M ${arc.rx}, ${arc.ry} a ${arc.rad} ${arc.rad} ${arc.start} ${arc.largeArcFlag} ${arc.sweepFlag} ${arc.dx},${arc.dy}`
  return (
    <main id="maincontainer" css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <svg css={css({width: '100vw', height: '100vh', position: 'absolute'})}>
        <path
          d={arcStr}
          fill="none"
          stroke="black"
          strokeWidth="30"/>
      </svg>
      <div css={css({width: '10rem', height: '6rem', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, margin: 'auto'})}>
        <h1>{angle}</h1>
        <button onClick={() => setActive(!active)}>click</button>
        <div><a href="https://github.com/kirisaki/react-svg">GitHub repository</a></div>
      </div>
    </main>
  )
}

type Arc = {
  rx: number
  ry: number
  rad: number
  start: number
  largeArcFlag: number
  sweepFlag: number
  dx: number
  dy: number
}

const convert = (x: number, y: number, rad: number, start: number, end_: number): Arc => {
  const end = end_ % 360
  const rx = x + rad * Math.cos(start/360*2*Math.PI)
  const ry = y + rad * Math.sin(start/360*2*Math.PI)
  const rx2 = x + rad * Math.cos(end/360*2*Math.PI)
  const ry2 = y + rad * Math.sin(end/360*2*Math.PI)
  const dx = rx2 - rx
  const dy = ry2 - ry
  const largeArcFlag = Math.abs(end) > 180 ? 1 : 0
  const sweepFlag = start < end ? 1 : 0
  return {rx, ry, rad, start, largeArcFlag, sweepFlag, dx, dy}
}
