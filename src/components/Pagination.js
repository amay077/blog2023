import React from "react"
import { Link } from "gatsby"

export const Pagination = ({ page, size, totalCount }) => {
  const PER_PAGE = size

  const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}>
      {range(1, Math.ceil(totalCount / PER_PAGE)).map((number, index) => (
        <div style={{ display: 'inline-flex',  flexDirection: 'row' }} key={index}>
          {index === 0 ? "" : '\u00A0\u00A0|\u00A0\u00A0'}
          {number === page ? 
            <div>{number}</div> : 
            <Link key={index} to={`/posts/page/${number}`}>{number}</Link>
          } 
        </div>
      ))}
    </div>
  )
}

export default Pagination;