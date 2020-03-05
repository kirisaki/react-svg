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
}

export const Arc: React.FC<Props> = ({rx, ry, rad, start, end, color}) => {
  const arc = convert(rx, ry, rad, start, end)
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

const convert = (x: number, y: number, rad: number, start: number, end_: number): ArcSet => {
  const end = end_ % 360
  const rx = x + rad * Math.cos(start/360*2*Math.PI)
  const ry = y + rad * Math.sin(start/360*2*Math.PI)
  const rx2 = x + rad * Math.cos(end/360*2*Math.PI)
  const ry2 = y + rad * Math.sin(end/360*2*Math.PI)
  const dx = rx2 - rx
  const dy = ry2 - ry
  const largeArcFlag = Math.abs(start - end) > 180 ? 1 : 0
  const sweepFlag = start < end ? 1 : 0
  return {rx, ry, rad, start, largeArcFlag, sweepFlag, dx, dy}
}
