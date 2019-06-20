import { Dispatch, AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import Repos from '../components/repo/Repos'
import { State, ReposParams } from '../redux/types'
import { fetchRepos } from '../redux/actions'

function mapStateToProps (state: State) {
  return {
    query: state.repos.data,
    repos: state.repos.items,
    totalCount: state.repos.totalCount
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    getRepos: (data: ReposParams) => {
      (dispatch as ThunkDispatch<State, void, AnyAction>)(fetchRepos(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repos)
