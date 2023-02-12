import styled from 'styled-components'

const Button = styled.a`
  display: inline-block;
  margin-right: 16px;
  outline: none;
  background-color: transparent;
  border: none;
  color: ${(props) => (props.active ? '#1F82D0' : '#555')};
  border-bottom: 1px solid ${(props) => (props.active ? '#1F82D0' : 'transparent')};
  padding: 0;
  cursor: pointer;
`

export default Button
