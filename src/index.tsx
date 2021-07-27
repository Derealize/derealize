import React from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter, Switch, Route } from 'react-router-dom'
import 'focus-visible/dist/focus-visible'
import { StoreProvider } from 'easy-peasy'
import { ChakraProvider } from '@chakra-ui/react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import './styles/app.global.scss'
import store from './reduxStore'
import Login from './components/Login'
import App from './App'
import AppStudio from './App.studio'
import mytheme from './theme'
import PrivateRoute from './utils/PrivateRoute'
import type { PreloadWindow } from './preload'

declare const window: PreloadWindow
const { isStudio } = window.env

dayjs.extend(utc)
// dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <ChakraProvider theme={mytheme}>
        <MemoryRouter>
          <Switch>
            <Route path="/" exact component={isStudio ? AppStudio : App} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </MemoryRouter>
      </ChakraProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
