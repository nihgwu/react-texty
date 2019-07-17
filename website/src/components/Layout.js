import React from 'react'
import Helmet from 'react-helmet'
import GithubCorner from 'react-github-corner'

import '../styles/index.css'

const Layout = ({ children }) => (
  <>
    <Helmet
      title="react-texty"
      meta={[
        {
          name: 'description',
          content:
            "A straight forward text component with tooltip support when it's truncated",
        },
        {
          name: 'keywords',
          content: 'react, component, text, ellipsis, tooltip',
        },
        {
          name: 'author',
          content: 'Neo Nie<nihgwu@live.com>',
        },
      ]}
    />
    <GithubCorner
      href="https://github.com/nihgwu/react-texty"
      size={100}
      bannerColor="#222"
    />
    <div className="content">{children}</div>
  </>
)

export default Layout
