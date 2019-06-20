import React from 'react'
// import { Link } from 'react-router-dom'
import { Card, Row, Col, Empty } from 'antd'
import withLoading from '../hoc/withLoading'

interface Props {
  list: any[];
  children?: React.ReactNode;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}

const { Meta } = Card

const List = (props: Props) => {
  const list = props.list

  return list.length
    ? (
      <Row gutter={15} type="flex">
        {
          list.map((item) => {
            item = item.owner || item
            return (
              <Col className="mt-3" xl={props.xl} lg={props.lg} md={props.md} sm={props.sm} xs={props.xs} key={item.id}>
                <Card
                  size="small"
                  hoverable
                  cover={<img alt="example" src={ item.avatar_url } />}
                >
                  <Meta
                    title={ item.login }
                  />
                </Card>
              </Col>
            )
          })
        }
        {
          props.children &&
          <Col span={24} className="text-center mt-5">
            { props.children }
          </Col>
        }
      </Row>
    ) : <Empty />
}

export default withLoading(List)
