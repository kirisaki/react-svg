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
  const [pos, setState] = useState({width: 0, height: 0})
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
  return (
    <main css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <svg id="svgcanvas" css={css({width: '100vw', height: '100vh', position: 'absolute'})}>
        <path d={`M ${pos.width/2}, ${pos.height/2} a 90 90 -30 0 1 0,90`} fill="none" stroke="black"/>
      </svg>
      <div css={css({width: '10rem', height: '6rem', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, margin: 'auto'})}>
        <h1>nyaan</h1>
      </div>
    </main>
  )
}
