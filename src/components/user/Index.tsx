import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Pagination, Empty } from 'antd'
import styles from './List.module.scss'
import withLoading from '../hoc/withLoading'

interface PageQuery {
  page?: number;
  per?: number;
}

export interface User {
  [propName: string]: any;
  id: number;
  avatar_url: string;
  login: string;
}

interface Props {
  list?: User[];
  current?: number;
  per?: number;
  totalCount?: number;
  onChangeQuery(listQuery: PageQuery): void;
}

const { Meta } = Card

class UserList extends React.Component<Props> {
  public constructor (props: Props) {
    super(props)
    this.state = {}

    this.onPageChange = this.onPageChange.bind(this)
  }

  public render () {
    return this.props.list && this.props.list.length
      ? (
        <Row gutter={15} justify="center">
          {
            this.props.list.map((item) => (
              <Col lg={4} md={6} sm={12} xs={24} key={item.id}>
                <Link to={{ pathname: `/user/${item.id}`, state: { user: item } }}>
                  <Card
                    className={styles.card}
                    hoverable
                    cover={<img alt="example" src={ item.avatar_url } />}
                  >
                    <Meta
                      title={ item.login }
                    />
                  </Card>
                </Link>
              </Col>
            ))
          }

          <Col span={24} className={styles.center}>
            <Pagination
              showSizeChanger
              showQuickJumper
              size="small"
              pageSizeOptions={[ '12', '24', '36', '48', '60' ]}
              className={ styles.pages }
              current={ this.props.current }
              pageSize={ this.props.per }
              total={ this.props.totalCount }
              onChange={ this.onPageChange }
              onShowSizeChange={ this.onPageChange }
            />
          </Col>
        </Row>
      ) : <div className={styles.wrap}><Empty /></div>
  }

  public onPageChange (page: number, pageSize: number|undefined) {
    this.props.onChangeQuery({
      page,
      per: pageSize
    })
  }
}

export default withLoading(UserList)
