import React from 'react'
import { Pagination } from 'antd'
import withLoading from '../hoc/withLoading'
import api from '../../utils/api'
import request from '../../utils/request'
import ListItem from './List'

interface Query {
  q?: string;
  page?: number;
  perPage?: number;
  totalCount?: number;
}

export interface Repo {
  id: number;
  [propName: string]: any;
}

interface Props {
  search: string;
}

interface State {
  list: Repo[];
  query: Query;
}

class RepoList extends React.Component<Props, State> {
  public constructor (props: Props) {
    super(props)
    this.state = {
      list: [],
      query: {
        q: '',
        page: 1,
        perPage: 20,
        totalCount: 0
      }
    }

    this.onPageChange = this.onPageChange.bind(this)
  }

  public render () {
    const query = this.state.query

    return (
      <div className="my-6">
        <ListItem list={this.state.list} xl={6} lg={8} md={8} sm={12} xs={24}>
          <Pagination
            showSizeChanger
            showQuickJumper
            size="small"
            pageSizeOptions={[ '12', '24', '36', '48', '60' ]}
            current={ query.page }
            pageSize={ query.perPage }
            total={ query.totalCount }
            onChange={ this.onPageChange }
            onShowSizeChange={ this.onPageChange }
          />
        </ListItem>
      </div>
    )
  }

  public componentDidMount () {
    // console.log(this.props.search)
    if (this.props.search !== this.state.query.q) {
      this.getRepos({
        q: this.props.search
      })
    }
  }

  public componentDidUpdate () {
    // console.log(this.props.search)
    if (this.props.search !== this.state.query.q) {
      this.getRepos({
        q: this.props.search
      })
    }
  }

  public onPageChange (page: number, perPage: number|undefined) {
    this.getRepos({
      page,
      perPage: perPage
    })
  }

  public getRepos (query: Query) {
    const state = this.state

    if (!query.page || (Object.keys(query).length > 1 && query.page === state.query.page)) {
      query.page = 1
    }

    query = Object.assign({}, state.query, query)

    this.setState({
      query: query
    })

    request(api.repo.search, {
      params: {
        'q': query.q,
        'page': query.page,
        'per_page': query.perPage
      }
    }, this).then((res) => {
      // console.log(res)
      this.setState({
        list: res.data.items,
        query: Object.assign({}, this.state.query, {
          totalCount: res.data.total_count
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  }
}

export default withLoading(RepoList)
