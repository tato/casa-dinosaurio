import { createSlice } from "@reduxjs/toolkit"
import casa from "./casa.jpg"

interface BoardState {
    backgroundImage: string,
}
const initialState: BoardState = {
    backgroundImage: casa,
}

export const boardSlice = createSlice({
    name: "board",
    initialState: initialState,
    reducers: {
        updateBackgroundImage(state, action) {
            state.backgroundImage = action.payload
        },
    }
})

export const { updateBackgroundImage, } = boardSlice.actions


export default boardSlice.reducer
