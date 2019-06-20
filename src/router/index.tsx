import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { routes, RouteConf } from './routes'

export const mapRoutes = (routes: RouteConf[]) => {
  return routes.map((route, i) => {
    return <Route
      key={ route.path || i }
      path={ route.path }
      exact={ !!route.exact }
      render={ props => (<route.component {...props} routes={route.routes} />) }
    />
  })
}

export default () => {
  return (
    <Switch>
      { mapRoutes(routes) }
    </Switch>
  )
}
