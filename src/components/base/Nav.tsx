import React from 'react'
import { NavLink } from 'react-router-dom'
import { Row, Col, Menu, Icon } from 'antd'
import SearchRepos from '@/containers/SearchRepos'

interface State {
  current: string;
}

class Users extends React.Component<{}, State> {
  public constructor (props: {}) {
    super(props)

    this.state = {
      current: ''
    }
  }

  public render () {
    return (
      <Row align="middle" type="flex">
        <Col span={18}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
            theme="dark"
          >
            <Menu.Item key="home">
              <NavLink to="/"><Icon type="home" />Home</NavLink>
            </Menu.Item>
            <Menu.Item key="collection">
              <Icon type="star" />Collection
            </Menu.Item>
            <Menu.Item key="about">
              <NavLink to="/about"><Icon type="heart" />About</NavLink>
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={6}>
          <SearchRepos />
        </Col>
      </Row>
    )
  }

  public handleClick () {}
}

export default Users
