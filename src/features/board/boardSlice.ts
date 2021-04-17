import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../.."
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
        deserializeBoard(state, action) {
            state.backgroundImage = action.payload.backgroundImage
        }
    }
})

export const { updateBackgroundImage, deserializeBoard, } = boardSlice.actions

export function selectSerializedBoard(state: RootState) {
    return {
        backgroundImage: state.board.backgroundImage
    }
}

export default boardSlice.reducer
