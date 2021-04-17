import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'

import { configureStore } from "@reduxjs/toolkit"
import boardReducer from "./features/board/boardSlice"
import widgetsReducer from "./features/widgets/widgetsSlice"
import { Board } from './features/board/Board'

const store = configureStore({
    reducer: {
        board: boardReducer,
        widgets: widgetsReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const storeVersion = 1
export function getState(): RootState {
    return store.getState()
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Board />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
