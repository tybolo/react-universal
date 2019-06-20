import React from 'react'
import { Pagination } from 'antd'
import withLoading from '../hoc/withLoading'
import ListItem from './List'
import { RepoItem, ReposParams } from '../../redux/types'

interface Props {
  search: string;
  query: ReposParams;
  repos: RepoItem[];
  totalCount: number;
  getRepos(data: ReposParams): void;
}

class RepoList extends React.Component<Props> {
  public constructor (props: Props) {
    super(props)
    this.state = {}

    this.onPageChange = this.onPageChange.bind(this)
  }

  public render () {
    const query = this.props.query

    return (
      <div className="my-6">
        <ListItem list={this.props.repos} xl={6} lg={8} md={8} sm={12} xs={24}>
          <Pagination
            showSizeChanger
            showQuickJumper
            size="small"
            pageSizeOptions={[ '12', '24', '36', '48', '60' ]}
            current={ query.page }
            pageSize={ query.per_page }
            total={ this.props.totalCount }
            onChange={ this.onPageChange }
            onShowSizeChange={ this.onPageChange }
          />
        </ListItem>
      </div>
    )
  }

  public componentDidMount () {
    // console.log(typeof this.props.search, typeof this.props.query.q)
    if ((!this.props.repos || !this.props.repos.length) && this.props.search !== this.props.query.q) {
      this.getRepos({
        q: this.props.search
      })
    }
  }

  // public componentDidUpdate () {
  //   // console.log(this.props.repos)
  //   if (this.props.search !== this.props.query.q) {
  //     this.getRepos({
  //       q: this.props.search
  //     })
  //   }
  // }

  public onPageChange (page: number, perPage: number|undefined) {
    this.getRepos({
      page,
      'per_page': perPage
    })
  }

  public getRepos (query: ReposParams) {
    if (!query.page || (Object.keys(query).length > 1 && query.page === this.props.query.page)) {
      query.page = 1
    }

    query = Object.assign({}, this.props.query, query)

    this.props.getRepos(query)
  }
}

export default withLoading(RepoList)
