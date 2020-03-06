/** @jsx jsx */
import * as React from 'react'
import { jsx } from '@emotion/core'

type Props = {
  rx: number
  ry: number
  rad: number
  start: number
  end: number
  color: string
  rotCW: boolean
}

export const Arc: React.FC<Props> = ({rx, ry, rad, start, end, color, rotCW}) => {
  const arc = convert(rx, ry, rad, start, end, rotCW)
  const arcStr = `M ${arc.rx}, ${arc.ry} a ${arc.rad} ${arc.rad} ${arc.start} ${arc.largeArcFlag} ${arc.sweepFlag} ${arc.dx},${arc.dy}`
  return (
    <path
      d={arcStr}
      fill="none"
      stroke={color}
      strokeWidth="30"/>
  )
}

type ArcSet = {
  rx: number
  ry: number
  rad: number
  start: number
  largeArcFlag: number
  sweepFlag: number
  dx: number
  dy: number
}

const convert = (x: number, y: number, rad: number, start_: number, end_: number, rotCW: boolean): ArcSet => {
  const end = end_ % 360
  const start= start_ % 360
  const rx = x + rad * Math.cos(start/360*2*Math.PI)
  const ry = y + rad * Math.sin(start/360*2*Math.PI)
  const rx2 = x + rad * Math.cos(end/360*2*Math.PI)
  const ry2 = y + rad * Math.sin(end/360*2*Math.PI)
  const dx = rx2 - rx
  const dy = ry2 - ry
  let sweepFlag = rotCW ? 1 : 0
  let largeArcFlag = 0
  const pos = end - start > 0
  if(rotCW && pos && Math.abs(end - start) > 180){
    largeArcFlag = 1
  }else if(rotCW && pos){
    largeArcFlag = 0
  }else if(rotCW && !pos && Math.abs(end - start) > 180){
    largeArcFlag = 0
  }else if(rotCW && !pos){
    largeArcFlag = 1
  }else if(!rotCW && pos && Math.abs(end - start) > 180){
    largeArcFlag = 0
  }else if(!rotCW && pos){
    largeArcFlag = 1
  }else if(!rotCW && !pos && Math.abs(end - start) > 180){
    largeArcFlag = 1
  }else if(!rotCW && !pos){
    largeArcFlag = 0
  }
  return {rx, ry, rad, start, largeArcFlag, sweepFlag, dx, dy}
}
