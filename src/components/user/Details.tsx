import React from 'react'
import styles from './Details.module.scss'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import withLoading from '../hoc/withLoading'
import { Card, Row, Col, Tabs, Empty } from 'antd'
import request from '../../utils/request'
import api from '../../utils/api'
import RepoList from '../repo/Index'

interface State {
  repos: any[];
}

const { Meta } = Card
const { TabPane } = Tabs

class UserList extends React.Component<RouteComponentProps, State> {
  private repoList: React.RefObject<any>

  public constructor (props: RouteComponentProps) {
    super(props)

    this.state = {
      repos: []
    }

    this.repoList = React.createRef()
  }

  public render () {
    const user = this.props.location.state.user

    return (
      <Row gutter={30} justify="center" type="flex">
        <Col xl={5} lg={6} md={6} sm={10} xs={16}>
          <a href={user.html_url} rel="noreferr">
            <Card
              size="small"
              className={styles.card}
              hoverable
              cover={<img alt="example" src={ user.avatar_url } />}
            >
              <Meta
                title={ user.login }
              />
            </Card>
          </a>
        </Col>
        <Col md={14} sm={24}>
          <Tabs defaultActiveKey="1" size="large">
            <TabPane tab="Repositories" key="1">
              <RepoList ref={this.repoList} repos={this.state.repos} />
            </TabPane>
            <TabPane tab="Tab 2" key="2"><Empty /></TabPane>
            <TabPane tab="Tab 3" key="3"><Empty /></TabPane>
          </Tabs>
        </Col>
      </Row>
    )
  }

  public componentDidMount () {
    this.getRepos()
  }

  public getRepos () {
    request(api.repo.list, {
      params: {
        username: this.props.location.state.user.login
      }
    }, this.repoList.current).then(res => {
      this.setState({
        repos: res.data
      })
    })
  }
}

export default withLoading(withRouter(UserList))
