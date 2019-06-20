import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import withLoading from '../hoc/withLoading'
import { Card, Row, Col, Tabs, Icon } from 'antd'
import request from '@/utils/request/index'
import api from '../../utils/api'
import RepoList from './List'
import UserList from '../user/List'
import { RepoItem, RepoParams } from '../../redux/types'
// import { fetchRepo } from '../../redux/actions'

type TabKey = 'repos' | 'forks' | 'stargazers';
interface MatchParams {
  user: string;
  repo: string;
}
interface Props extends RouteComponentProps<MatchParams> {
  repo?: RepoItem;
  getRepo(data: RepoParams): void;
  [propName: string]: any;
}
interface State {
  name: string;
  repos: any[];
  forks: any[];
  stargazers: any[];
  repo: any;
}

const { TabPane } = Tabs

class Details extends React.Component<Props, State> {
  private repoList: React.RefObject<any>
  private forksList: React.RefObject<any>
  private stargazersList: React.RefObject<any>

  // public static preFetch (store: any, ctx: any) {
  //   const username = ctx.params.user
  //   const reponame = ctx.params.repo

  //   return store.dispatch(fetchRepo({ username, reponame }))
  // }

  public constructor (props: Props) {
    super(props)

    this.state = {
      name: '',
      repos: [],
      forks: [],
      stargazers: [],
      repo: {}
    }

    this.onTabChange = this.onTabChange.bind(this)

    this.repoList = React.createRef()
    this.forksList = React.createRef()
    this.stargazersList = React.createRef()
  }

  public render () {
    // console.log(this.props, this.props.location)
    // const repo = this.props.repo ? this.props.repo : this.props.location.state.repo
    const repo = this.state.repo

    return (
      <Row className="my-6" gutter={50} justify="center" type="flex">
        <Col xl={4} lg={5} md={5} sm={6} xs={16}>
          <a href={repo.html_url}>
            <Card
              size="small"
              hoverable
              bordered={false}
              cover={<img alt="example" src={ repo.owner.avatar_url } />}
            >
            </Card>
          </a>
        </Col>

        <Col xl={20} lg={19} md={19} sm={18}>
          <h1>
            <a href={ repo.owner.html_url } target="_blank" rel="noopener noreferrer">{ repo.owner.login }</a>
            <span> / </span>
            <a href={ repo.html_url } target="_blank" rel="noopener noreferrer">{ repo.name }</a>
          </h1>
          <p>{ repo.description }</p>
          <p><a href={repo.homepage} target="_blank" rel="noopener noreferrer">{ repo.homepage }</a></p>
          <div>
            <p className="inline-block mr-5" title="language"><Icon className="mr-1" type="tag" theme="filled" />{ repo.language }</p>
            <p className="inline-block mr-5" title="watchers"><Icon className="mr-1" type="github" theme="filled" />{ repo.watchers_count }</p>
            <p className="inline-block mr-5" title="stars"><Icon className="mr-1" type="star" theme="filled" />{ repo.stargazers_count }</p>
            <p className="inline-block mr-5" title="forks"><Icon className="mr-1" type="eye" theme="filled" />{ repo.forks_count }</p>
          </div>
          <Tabs className="my-3" defaultActiveKey="repos" size="large" animated={false} onChange={this.onTabChange}>
            <TabPane tab="Repositories" key="repos">
              <RepoList list={this.state.repos} ref={this.repoList} avatar={false} xs={12} lg={6} />
            </TabPane>
            <TabPane tab="Forks" key="forks" forceRender={true}>
              <UserList list={this.state.forks} ref={this.forksList} xl={4} lg={6} md={8} sm={8} xs={12} />
            </TabPane>
            <TabPane tab="Stargazers" key="stargazers" forceRender={true}>
              <UserList list={this.state.stargazers} ref={this.stargazersList} xl={4} lg={6} md={8} sm={8} xs={12} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    )
  }

  public componentWillMount () {
    this.setState({
      repo: this.props.location.state ? this.props.location.state.repo : this.props.repo
    })
  }

  public componentDidMount () {
    this.getRepos()
  }

  public componentDidUpdate () {
    // console.log(this.props.match.params.id, this.state.id)
    if (this.props.match.params.repo !== this.state.name) {
      this.getRepos()
      this.setState({
        name: this.props.match.params.repo,
        forks: [],
        stargazers: []
      })
    }
  }

  public onTabChange (key: string) {
    switch (key) {
      case 'forks':
        if (!this.state.forks || !this.state.forks.length) this.getForks()
        break
      case 'stargazers':
        if (!this.state.stargazers || !this.state.stargazers.length) this.getStargazers()
        break
      default:
        break
    }
  }

  // public onTabChange (key: string) {
  //   const a: keyof State = key as keyof State
  //   const map = {
  //     forks: 'getForks',
  //     stargazers: 'getStargazers'
  //   }

  //   if (!this.state[a] || !this.state[a].length) {
  //     this[map[a]]()
  //   }
  // }

  public getRepos () {
    request(api.repo.list, {
      params: {
        username: this.state.repo.owner.login
      }
    }, this.repoList.current).then(res => {
      this.setState({
        repos: res.data
      })
    })
  }

  public getForks () {
    request(api.repo.forks, {
      params: {
        username: this.state.repo.owner.login,
        reponame: this.state.repo.name
      }
    }, this.forksList.current).then(res => {
      this.setState({
        forks: res.data
      })
    })
  }

  public getStargazers () {
    request(api.repo.stargazers, {
      params: {
        username: this.state.repo.owner.login,
        reponame: this.state.repo.name
      }
    }, this.stargazersList.current).then(res => {
      this.setState({
        stargazers: res.data
      })
    })
  }
}

export default withLoading(withRouter(Details))
