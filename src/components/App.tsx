/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Global, jsx, css } from '@emotion/core'
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
`

export const App: React.FC = () => {
  const [screen, setState] = useState({width: 0, height: 0})
  const prev = useRef({width: 0, height: 0})
  useEffect(() => {
    const resizeObserver = new ResizeObserver(es => {
      for (let e of es){
        if (e.target.id === 'svgcanvas'){
          const width = e.target.clientWidth
          const height= e.target.clientHeight
          if(prev.current.width !== width || prev.current.height !== height){
            setState({width, height})
          }
        }
      }
    })
    const target = document.getElementById('svgcanvas')
    resizeObserver.observe(target)
    return () => resizeObserver.unobserve(target)
  })
  const arc = convert(screen.width/2, screen.height/2, 70, -10, 170)
  return (
    <main css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <svg id="svgcanvas" css={css({width: '100vw', height: '100vh', position: 'absolute'})}>
        <path d={`M ${arc.rx}, ${arc.ry} a ${arc.rad} ${arc.rad} ${arc.start} ${arc.largeArcFlag} ${arc.sweepFlag} ${arc.dx},${arc.dy}`} fill="none" stroke="black"/>
      </svg>
      <div css={css({width: '10rem', height: '6rem', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, margin: 'auto'})}>
        <h1>nyaan</h1>
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

const convert = (x: number, y: number, rad: number, start: number, end: number): Arc => {
  const rx = x + rad * Math.cos(start/360*2*Math.PI)
  const ry = y + rad * Math.sin(start/360*2*Math.PI)
  const rx2 = x + rad * Math.cos(end/360*2*Math.PI)
  const ry2 = y + rad * Math.sin(end/360*2*Math.PI)
  const dx = rx2 - rx
  const dy = ry2 - ry
  return {rx, ry, rad, start, largeArcFlag: 0, sweepFlag: 1, dx, dy}
}
