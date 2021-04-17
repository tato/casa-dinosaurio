import { createSlice } from "@reduxjs/toolkit"
import background from "./background.jpg" // Photo by Anukrati Omar on Unsplash
  

interface BoardState {
    backgroundImage: string,
}
const initialState: BoardState = {
    backgroundImage: background,
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
