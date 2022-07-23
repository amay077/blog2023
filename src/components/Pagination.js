import React from "react"
import { Link } from "gatsby"

const h1Size = {　　　　　// 自分でつけた任意の名前
  fontSize: '1.25rem',   // font-sizeとするところfontSizeとする。React特有の書き方
  lineHeight: 1.75,   // line-heightとするところlineHeight
  dis: 'flex'
}

export const Pagination = ({ size, totalCount }) => {
  const PER_PAGE = size

  const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }}>
      {range(1, Math.ceil(totalCount / PER_PAGE)).map((number, index) => (
        <div style={{ display: 'inline-flex',  flexDirection: 'row' }} key={index}>
          {index == 0 ? "" : '\u00A0|\u00A0'}
          <Link key={index} to={`/posts/page/${number}`}>{number}</Link>
        </div>
      ))}
    </div>
  )
}

export default Pagination;