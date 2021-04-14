import { createEntityAdapter, createSlice, EntityId, nanoid } from "@reduxjs/toolkit"
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



export const widgetsSlice = createSlice({
    name: "widgets",
    initialState: {
        ...widgetsAdapter.getInitialState(),
    },
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
                if (direction.includes("E")) {
                    widget.width += dx
                } else if (direction.includes("W")) {
                    widget.width -= dx
                    widget.x += dx
                }
                if (direction.includes("S")) {
                    widget.height += dy
                } else if (direction.includes("N")) {
                    widget.height -= dy
                    widget.y += dy
                }

                if (widget.proportional) {
                    let width
                    let height
                    if (dx >= 0 && dy >= 0) {
                        width = Math.max(widget.width, widget.height)
                        height = Math.max(widget.width, widget.height)
                    } else {
                        width = Math.min(widget.width, widget.height)
                        height = Math.min(widget.width, widget.height)
                    }
                    if (direction.includes("W"))
                        widget.x += widget.width - width
                    if (direction.includes("N"))
                        widget.y += widget.height - height
                    widget.width = width
                    widget.height = height
                }

                widget.width = Math.max(16, widget.width)
                widget.height = Math.max(16, widget.height)

                // TODO! PURE E OR PURE N RESIZING ON PROPORTIONAL WIDGETS DOESN'T DO ANYTHING
                // TODO! E OR N RESIZING A WIDGET THAT IS ALREADY MINIMUM SIZE MOVES IT
            }
        }
    }
})

export const { addTokenWidget, addTextWidget, updateText, removeWidget, moveWidget, resizeWidget } = widgetsSlice.actions

export const {
    selectAll: selectAllWidgets,
    selectById: selectWidgetById,
    selectIds: selectWidgetIds
} = widgetsAdapter.getSelectors((state: RootState) => state.widgets)

export default widgetsSlice.reducer
