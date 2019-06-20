import { Dispatch, AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import Details from '../components/repo/Details'
import { State, RepoParams } from '../redux/types'
import { fetchRepo } from '../redux/actions'

function mapStateToProps (state: State) {
  return {
    repo: state.repos.item
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    getRepo: (data: RepoParams) => {
      (dispatch as ThunkDispatch<State, void, AnyAction>)(fetchRepo(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details)
