import React from 'react'

const Tag = ({ name }) => (
  <div
    style={{
      color: '#8f8f8f',
      marginRight: '8px',
      display: 'inline-block',
      fontSize: '14px',
      borderRadius: '4px',
    }}
  >
    # {name}
  </div>
)

export default Tag
