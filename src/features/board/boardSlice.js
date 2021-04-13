import { createSlice } from "@reduxjs/toolkit"
import casa from "./casa.jpg"

export const boardSlice = createSlice({
    name: "board",
    initialState: {
        backgroundImage: casa,
    },
    reducers: {
        updateBackgroundImage(state, action) {
            state.backgroundImage = action.payload
        },
    }
})

export const { updateBackgroundImage } = boardSlice.actions

export default boardSlice.reducer