import React from 'react'
import styled from 'styled-components'
import Searchbar from './SearchBar'

const Header = styled.header`
  height: 70px;
  line-height: 70px;
  background-color: #005ba1;
  color: #fbfbfb;
  box-shadow: 0 1px 5px rgba(0,0,0,.4);
`

export default () => {
  return <Header>
    <div className="container">
      <div className="flag flag-middle">
        <div className="flag-body">黄金0000</div>
        <div className="flag-item">
          <Searchbar />
        </div>
      </div>
    </div>
  </Header>
}
