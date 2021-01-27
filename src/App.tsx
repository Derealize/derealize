import React from 'react'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import 'focus-visible/dist/focus-visible'
import { StoreProvider } from 'easy-peasy'
import { ChakraProvider } from '@chakra-ui/react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import store from './reduxStore'
import Test from './components/Test'
import Login from './components/Login'
import mytheme from './theme'
import PrivateRoute from './utils/PrivateRoute'

dayjs.extend(utc)
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const App = (): JSX.Element => {
  return (
    <div className="app">
      <StoreProvider store={store}>
        <ChakraProvider theme={mytheme}>
          <Router>
            <Switch>
              {/* <PrivateRoute path="/" exact component={Home} /> */}
              <Route path="/" exact component={Test} />
              <Route path="/login" exact component={Login} />
            </Switch>
          </Router>
        </ChakraProvider>
      </StoreProvider>
    </div>
  )
}

export default App
