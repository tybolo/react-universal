import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Empty, Avatar } from 'antd'
import withLoading from '../hoc/withLoading'

interface Props {
  list: any[];
  children?: React.ReactNode;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  avatar?: boolean;
  // ref?: any;
}

const { Meta } = Card

const List = (props: Props) => {
  const list = props.list

  return list.length
    ? (
      <Row gutter={15} type="flex">
        {
          list.map((item) => (
            <Col className="mt-3" xl={props.xl} lg={props.lg} md={props.md} sm={props.sm} xs={props.xs} key={item.id}>
              <Link to={{ pathname: `/repos/${item.full_name}`, state: { repo: item } }} title={item.name}>
                <Card
                  hoverable
                >
                  <Meta
                    avatar={props.avatar === false ? '' : <Avatar src={item.owner.avatar_url} shape="square" size={80} />}
                    title={item.name}
                    description={<p className="text-line-2">{ item.description }</p>}
                  />
                </Card>
              </Link>
            </Col>
          ))
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
