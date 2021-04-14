import { createSlice, EntityId } from "@reduxjs/toolkit"
import { RootState } from "../.."
import casa from "./casa.jpg"

interface BoardState {
    backgroundImage: string,
    draggingWidgetId: EntityId | null,
    draggingAction: string,
}
const initialState: BoardState = {
    backgroundImage: casa,
    draggingWidgetId: null,
    draggingAction: "move",
}

export const boardSlice = createSlice({
    name: "board",
    initialState: initialState,
    reducers: {
        updateBackgroundImage(state, action) {
            state.backgroundImage = action.payload
        },
        startDragging(state, action) {
            let { widgetId, action: kind } = action.payload
            state.draggingWidgetId = widgetId
            state.draggingAction = kind
        },
        stopDragging(state) {
            state.draggingWidgetId = null
        }
    }
})

export const { updateBackgroundImage, startDragging, stopDragging } = boardSlice.actions

export const selectDraggingWidgetId = 
    (state: RootState) => state.board.draggingWidgetId
export const selectDraggingAction = 
    (state: RootState) => state.board.draggingAction

export default boardSlice.reducer
