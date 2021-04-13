import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'

import { configureStore } from "@reduxjs/toolkit"
import boardReducer from "./features/board/boardSlice"
import widgetsReducer from "./features/widgets/widgetsSlice"

export let store = configureStore({
  reducer: {
    board: boardReducer,
    widgets: widgetsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export function getState() {
  return store.getState()
}
export function replaceState(state: RootState) {
  store = configureStore({
    reducer: {
      board: boardReducer,
      widgets: widgetsReducer,
    },
    preloadedState: state,
  })
  render()
}

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
render()


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
