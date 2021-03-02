import React from 'react'
import ReactDOM from 'react-dom'
import 'focus-visible/dist/focus-visible'
import { StoreProvider } from 'easy-peasy'
import { ChakraProvider } from '@chakra-ui/react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import './styles/app.global.scss'
import store from './reduxStore'
import TopBar from './components/TopBar'
import mytheme from './theme'
import './ipc'

dayjs.extend(utc)
// dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const anchor = document.createElement('div')
anchor.id = 'derealize-anchor'
document.body.appendChild(anchor)

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <ChakraProvider theme={mytheme}>
        <TopBar />
      </ChakraProvider>
    </StoreProvider>
  </React.StrictMode>,
  anchor,
)
