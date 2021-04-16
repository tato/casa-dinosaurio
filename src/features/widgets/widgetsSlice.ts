import { createEntityAdapter, createSlice, EntityId, EntityState, nanoid } from "@reduxjs/toolkit"
import { RootState } from "../../index"

interface BaseWidget {
    id: string
    x: number
    y: number
    width: number
    height: number
    proportional: boolean
}
interface TokenWidget extends BaseWidget {
    kind: "token"
}
interface TextWidget extends BaseWidget {
    kind: "text"
    text: string
}
type Widget = TokenWidget | TextWidget


// TODO! this helper might be a bit wacky
export function getDraggingAction(action: string, widgetId: EntityId, dx: number, dy: number) {
    if (action === "move") {
        return moveWidget({widgetId, dx, dy})
    } else if (action.startsWith("resize")) {
        const direction = action.substring(6)
        return resizeWidget({widgetId, dx, dy, direction})
    }
}

const widgetsAdapter = createEntityAdapter<Widget>()

interface WidgetsState extends EntityState<Widget> {
    focusedWidget: EntityId | null,
}
let initialState: WidgetsState = {
    ...widgetsAdapter.getInitialState(),
    focusedWidget: null,
}

export const widgetsSlice = createSlice({
    name: "widgets",
    initialState,
    reducers: {
        addTokenWidget: {
            reducer: widgetsAdapter.addOne,
            prepare(x, y, width, height) {
                const token: TokenWidget = {
                    id: nanoid(),
                    kind: "token",
                    x: Number(x) || 0,
                    y: Number(y) || 0,
                    width: Number(width) || 0,
                    height: Number(height) || 0,
                    proportional: true,
                }
                return { payload: token }
            },
        },
        addTextWidget: {
            reducer: widgetsAdapter.addOne,
            prepare(x, y, width, height) {
                const text: TextWidget = {
                    id: nanoid(),
                    kind: "text",
                    x: Number(x) || 0,
                    y: Number(y) || 0,
                    width: Number(width) || 0,
                    height: Number(height) || 0,
                    proportional: false,
                    text: "",
                }
                return { payload: text }
            },
        },
        updateText(state, action: { payload: { widgetId: EntityId, text: string } }) {
            let { widgetId, text } = action.payload
            let widget = state.entities[widgetId]
            if (widget && widget.kind === "text") {
                widget.text = text
            }
        },
        removeWidget(state, action) {
            state.focusedWidget = null
            widgetsAdapter.removeOne(state, action.payload)
        },
        moveWidget(state, action) {
            let { widgetId, dx, dy } = action.payload
            let widget = state.entities[widgetId]
            if (widget) {
                widget.x += dx
                widget.y += dy
            }
        },
        resizeWidget(state, action) {
            let { widgetId, dx, dy, direction } = action.payload

            let widget = state.entities[widgetId]
            if (widget) {
                let diff = { width: 0, height: 0 }

                if (direction.includes("E")) {
                    diff.width = dx
                } else if (direction.includes("W")) {
                    diff.width = -dx
                }

                if (direction.includes("S")) {
                    diff.height = dy
                } else if (direction.includes("N")) {
                    diff.height = -dy
                }

                if (widget.proportional) {
                    if (diff.width >= 0 && diff.height >= 0) {
                        diff.width = Math.max(diff.width, diff.height)
                        diff.height = Math.max(diff.width, diff.height)
                    } else {
                        diff.width = Math.min(diff.width, diff.height)
                        diff.height = Math.min(diff.width, diff.height)
                    }
                }

                if (widget.width + diff.width >= 16 && widget.height + diff.height >= 16) {
                    widget.width += diff.width
                    widget.height += diff.height
                    if (direction.includes("W")) widget.x -= diff.width
                    if (direction.includes("N")) widget.y -= diff.height
                }
            }
        },
        focusWidget(state, action) {
            state.focusedWidget = action.payload.widgetId
        },
        unfocusWidget(state) {
            // Note: removeWidget also unfocuses
            state.focusedWidget = null
        }
    }
})

export const { addTokenWidget, addTextWidget, updateText, removeWidget, moveWidget, resizeWidget, focusWidget, unfocusWidget } = widgetsSlice.actions

export const {
    selectAll: selectAllWidgets,
    selectById: selectWidgetById,
    selectIds: selectWidgetIds
} = widgetsAdapter.getSelectors((state: RootState) => state.widgets)

export const selectFocusedWidgetId = (state: RootState) => state.widgets.focusedWidget

export default widgetsSlice.reducer
