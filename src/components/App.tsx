/** @jsx jsx */
import * as React from 'react'
import { Global, jsx, css } from '@emotion/core'

const globalStyle = css`
  * {
      padding: 0;
      margin: 0;
      background-color: #333;
      color: #eee;
    }
`

export const App: React.FC = () => {
  return (
    <main css={css({width: '100vw', height: '100vh', position: 'relative'})}>
      <Global styles={globalStyle} />
      <svg css={css({width: '100vw', height: '100vh', position: 'absolute'})}>
      </svg>
      <div css={css({width: '10rem', height: '6rem', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, margin: 'auto'})}>
        <h1>nyaan</h1>
      </div>
    </main>
  )
}
