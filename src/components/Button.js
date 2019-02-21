import React from 'react'
import g from 'glamorous'

export default ({ active, children, onClick }) => (
  <g.A
    display="inline-block"
    marginRight="16px"
    outline="none"
    backgroundColor="transparent"
    border="none"
    color={active ? '#1F82D0' : '#555'}
    borderBottom={`1px dashed ${active ? '#1F82D0' : 'transparent'}`}
    padding="0"
    cursor="pointer"
    onClick={onClick ? onClick : () => {}}
  >
    {children}
  </g.A>
)
