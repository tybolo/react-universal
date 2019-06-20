import React from 'react'
import styles from '@/styles/test.m.scss'
import styled from 'styled-components'

const Prap = styled.p`
  font-size: 20px;
  color: #333;
  transform: translate(20px, 40px);
  font-weight: bold;
`

export default () => {
  return (
    <>
      <h1 className={`${styles.hAa} py6 text-center`}>Welcome To Github Developer!@@</h1>
      <Prap className="text-right">fjdsjfslkdfjsdlfs</Prap>
    </>
  )
}
