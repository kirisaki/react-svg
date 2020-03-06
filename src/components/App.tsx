/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Arc } from './Arc'
import { Global, jsx, css } from '@emotion/core'
import { newRandGen, randNext, randRange } from 'fn-mt'

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

type Ring = {
  start: number
  now: number
  end: number
  rad: number
  color: string
}
export const App: React.FC = () => {
  // Adjust center on the browser
  const [screen, setScreen] = useState({width: -1, height: -1})
  const prev = useRef({width: -2, height: -2})
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

  //Initilize rings' state
  const [rings, setRings] = useState(() => {
    let gen = newRandGen(Date.now())
    // Stabilize random generator
    for(let i = 0; i < 4000; i++){
      const [_, g] = randNext(gen)
      gen = g
    }
    const rads = [...Array(20).keys()].map(i => i * 30)
    let results: Ring[] = []
    for (const rad of rads){
      const [start, g1] = randRange(0, 360, gen)
      const [end, g2] = randRange(0, 360, g1)
      gen = g2
      results.push({start, now: start, end, rad, color: "#f48"})
    }
    return results
  })

  // Animate state
  const [tick, setTick] = useState(0)
  const requestRef = React.useRef(0)
  const prevTimeRef = React.useRef(0)
  
  const animate = (time: number) => {
    const deltaTime = time - prevTimeRef.current
    setTick(prevCount => (prevCount + deltaTime * 1) % 5000)
    setRings(rings.map(r => ({...r, now: (r.start + (r.star < r.end == 0 ? -1 : 1) * (r.end - r.start) * (tick / 5000)) % 360})))
    prevTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }
  const [active, setActive] = useState(true)
  useEffect(() => {
    if(active){
      requestRef.current = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(requestRef.current)
    }
  }, [tick])

  return (
    <main id="maincontainer" css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <svg css={css({width: '100vw', height: '100vh', position: 'absolute'})}>
      {rings.map(r => renderRing(screen.width/2, screen.height/2, r))}
      </svg>
      <div css={css({width: '10rem', height: '6rem', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, margin: 'auto'})}>
        <h1>svg-animation</h1>
        <button onClick={() => setActive(!active)}>click</button>
        <div><a href="https://github.com/kirisaki/react-svg">GitHub repository</a></div>
      </div>
    </main>
  )
}

const renderRing = (rx: number, ry: number, r: Ring) =>{ 
  return(
    <Arc
      key={r.rad}
      rx={rx}
      ry={ry}
      rad={r.rad}
      start={r.start}
      end={r.now}
      rot={r.rot}
      color={r.color}
    />
  )
}
