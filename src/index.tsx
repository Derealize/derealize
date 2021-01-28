import React from 'react'
import ReactDOM from 'react-dom'
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
import App from './App'
import mytheme from './theme'
import PrivateRoute from './utils/PrivateRoute'
import './ipc'

dayjs.extend(utc)
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <ChakraProvider theme={mytheme}>
        <Router>
          <Switch>
            <Route path="/" exact component={App} />
            {/* <Route path="/" exact component={Test} /> */}
            <PrivateRoute path="/test" exact component={Test} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </Router>
      </ChakraProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
