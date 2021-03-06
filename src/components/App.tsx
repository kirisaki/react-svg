/** @jsx jsx */
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Arc } from './Arc'
import { Global, jsx, css } from '@emotion/core'
import { newRandGen, randNext, randRange } from 'fn-mt'

const globalStyle = css({
  '*': {
    padding: 0,
    margin: 0,
  },
  html: {
    backgroundColor: '#333',
    color: '#eee',
    fontFamily: "'Josefin Sans', sans-serif",
  },
  a: {
    color: '#eee',
    textDecoration: 'none',
  },
  button: {
    width: '6rem',
    height: '2rem',
    padding: '0.2rem',
    margin: '0.5rem',
    backgroundColor: 'transparent',
    color: '#eee',
    border: '1px #eee solid',
    borderRadius: '1rem',
    fontFamily: "'Josefin Sans', sans-serif",
    transition: '0.2s',
  },
  'button:hover': {
    backgroundColor: '#eee',
    color: '#333',
  }
})

type Ring = {
  key: number
  start: number
  now: number
  end: number
  rad: number
  color: string
  rotCW: boolean
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
  const emptyRing: Ring[] = []
  const [rings, setRings] = useState(emptyRing)
  const gen = useRef(newRandGen(Date.now()))
  const setGenWithSeed = (n: number) => {
    let g = newRandGen(n)
    // Stabilize random generator
    for(let i = 0; i < 4000; i++){
      const [, g1] = randNext(g)
      g = g1
    }
    gen.current = g
  }
  const generate = () => {
    let g = gen.current
    const rads = [...Array(20).keys()].map(i => i * 30).concat([...Array(20).keys()].map(i => i * 30)).concat([...Array(20).keys()].map(i => i * 30))
    let results: Ring[] = []
    rads.forEach((rad, key) => {
      const [n1, g1] = randRange(0, 360, g)
      const [n2, g2] = randRange(0, 360, g1)
      const [hue, g3] = randRange(0, 360, g2)
      const [rot, g4] = randRange(0, 2, g3)
      g = g4
      let start = 0
      let end = 0
      if(n1 < n2){
        start = n1
        end = n2
      }else{
        start = n2
        end = n1
      }
      const color = hsvToRgbHex(hue, 1, 1)
      const rotCW = rot == 0 ? false : true
      results.push({key, start: start, now: start, end, rad, color, rotCW})
    })
    gen.current = g
    setRings(results)
  }

  // Animation state
  const [tick, setTick] = useState(0)
  const requestRef = React.useRef(0)
  const prevTimeRef = React.useRef(0)
  const [active, setActive] = useState(true)
  
  const animate = (time: number) => {
    if(active){
      setTick(prevCount => (prevCount + 60))
      setRings(rings.map(r => ({...r, now: (r.start + (r.rotCW ? 1 : -1) * (r.end - r.start) * (tick / 1000)) % 360})))
    }
    if(active && tick >= 1000){
      setTick(1000)
      setActive(false)
    }
    prevTimeRef.current = time
  }
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {}//cancelAnimationFrame(requestRef.current)
  }, [tick])

  // Seed number state
  const [seed, setSeed] = useState('seed value')

  // Event handlers
  const randomHandler = () => {
    const g = newRandGen(Date.now())
    const [s,] = randNext(g)
    setSeed(s.toString())
    setGenWithSeed(s)
    setRings([])
    generate()
    setTick(0)
    setActive(true)
  }
  const fromSeedHandler = () => {
    const s = parseInt(seed, 10)
    console.log(s)
    if(!s){
      setSeed('invalid input')
      return
    }
    setGenWithSeed(s)
    setRings([])
    generate()
    setTick(0)
    setActive(true)
  }

  return (
    <main id="maincontainer" css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <svg css={css({width: '100vw', height: '100vh', position: 'absolute'})}>
      {rings.map(r => renderRing(screen.width/2, screen.height/2, r))}
      </svg>
      <div css={css({
        width: '15rem',
        height: '11rem',
        position: 'absolute',
        right: 0, left: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        padding: '1rem',
        boxSizing: 'border-box',
        borderRadius: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      })}>
        <h1 css={css({fontSize: '1.5rem'})}>svg-animation</h1>
        <input type="text" css={css({
          width: '100%',
          backgroundColor: 'transparent',
          border: '0px solid #eee',
          borderBottomWidth: '1px',
          textAlign: 'right',
          fontFamily: "'Fira Code', monospace",
          fontSize: '1.5rem',
          color: '#eee',
        })} 
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
        <div css={css({display: 'flex'})}>
          <button onClick={randomHandler}>Random</button>
          <button onClick={fromSeedHandler}>From seed</button>
        </div>
        <div css={css({display: 'flex', paddingTop: '0.5rem', alignItems: 'center'})}>
          <div css={css({width: '30%', fontSize: '1.5rem'})}><a href="https://github.com/kirisaki/react-svg"><i className="fab fa-github"></i></a></div>
          <div css={css({width: '70%', textAlign: 'right'})}><a href="https://twitter.com/A_kirisaki">@A_kirisaki</a></div>
        </div>
      </div>
    </main>
  )
}

const renderRing = (rx: number, ry: number, r: Ring) =>{ 
  return(
    <Arc
      key={r.key}
      rx={rx}
      ry={ry}
      rad={r.rad}
      start={r.start}
      end={r.now}
      color={r.color}
      rotCW={r.rotCW}
    />
  )
}

const hsvToRgbHex = (H: number , S: number, V:number): string => {
    const C = V * S
    const Hp = H / 60
    const X = C * (1 - Math.abs(Hp % 2 - 1))

    let [R, G, B] = [0, 0, 0]
    if (0 <= Hp && Hp < 1){
      [R,G,B]=[C,X,0]
    }else if(1 <= Hp && Hp < 2){
      [R,G,B]=[X,C,0]
    }else if(2 <= Hp && Hp < 3){
      [R,G,B]=[0,C,X]
    }else if(3 <= Hp && Hp < 4){
      [R,G,B]=[0,X,C]
    }else if(4 <= Hp && Hp < 5){
      [R,G,B]=[X,0,C]
    }else if(5 <= Hp && Hp < 6){
      [R,G,B]=[C,0,X]
    }

    const m = V - C;
    [R, G, B] = [R+m, G+m, B+m]

    R = Math.floor(R * 255)
    G = Math.floor(G * 255)
    B = Math.floor(B * 255)

    const f = (x: number): string => ('00' + x.toString(16)).slice(-2)
    return ('#' + f(R) + f(G) + f(B))
}
