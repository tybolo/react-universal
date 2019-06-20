import React from 'react'
import { Spin } from 'antd'

interface Props {
  [propName: string]: any;
}

interface State {
  spinning: boolean;
}

export default function (WrappedComponent: any) {
  return class High extends React.Component<Props, State> {
    public constructor (props: Props) {
      super(props)

      this.state = {
        spinning: false
      }

      this.onChangeSpinState = this.onChangeSpinState.bind(this)
    }

    public render () {
      return (
        <Spin spinning={this.state.spinning} size="large">
          <WrappedComponent onChangeSpinState={this.onChangeSpinState} {...this.props} />
        </Spin>
      )
    }

    public onChangeSpinState (state: boolean) {
      this.setState({
        spinning: state
      })
    }

    // public componentDidUpdate () {
    //   console.log(this.state.spinning)
    //   if (typeof this.props.spinning !== 'boolean') return
    //   this.setState({
    //     spinning: this.props.spinning
    //   })
    // }
  }
}
