import React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ThunkDispatch } from 'redux-thunk'
import { fetchRepos } from '../redux/actions'
import { State, ReposParams } from '../redux/types'
import { Input } from 'antd'

export interface Props extends RouteComponentProps {
  query: ReposParams;
  search(query: ReposParams, oldQuery?: ReposParams): Promise<any>;
}

class Search extends React.Component<Props> {
  public constructor (props: Props) {
    super(props)

    this.onSearch = this.onSearch.bind(this)
  }

  public render () {
    return (
      <Input.Search
        placeholder="Repo Name"
        suffix={<span />}
        onSearch={this.onSearch}
        style={{ backgroundColor: '#005ba1', border: 0 }}
      />
    )
  }

  public onSearch (val: string) {
    // const query = Object.assign({}, this.props.query, {
    //   q: val,
    //   page: 1
    // })
    this.props.search({
      q: val
    }, this.props.query).then(() => {
      this.props.history.push('/search/' + val)
    })
  }
}

function mapStateToProps (state: State) {
  return {
    query: state.repos.data
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    search: (query: ReposParams, oldQuery?: ReposParams) => {
      return (dispatch as ThunkDispatch<State, void, AnyAction>)(fetchRepos(query, oldQuery))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Search))
