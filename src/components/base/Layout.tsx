import React from 'react'
import { Layout, Spin, Icon } from 'antd'
import Nav from './Nav'
import { RouteConf } from '@/router/routes'
import { mapRoutes } from '@/router'
// import Header from './Header'

const { Content, Header } = Layout

Spin.setDefaultIndicator(<Icon type="loading" style={{ fontSize: 24 }} spin />)

export interface Props {
  routes: RouteConf[];
}

// const App = ({ routes }: Props) => {
//   return (
//     <Layout>
//       <Header></Header>
//       <Content className="container py6">
//         { mapRoutes(routes) }
//       </Content>
//     </Layout>
//   )
// }

const App = ({ routes }: Props) => {
  return (
    <Layout>
      <Header>
        <div className="container">
          <Nav />
        </div>
      </Header>
      <Content className="container">
        { mapRoutes(routes) }
      </Content>
    </Layout>
  )
}

export default App
