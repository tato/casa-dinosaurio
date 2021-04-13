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
            let { widgetId, dx, dy } = action.payload
            let widget = state.entities[widgetId]
            if (widget) {
                if (widget.proportional) {
                    if (dx >= 0 && dy >= 0) {
                        widget.width += Math.max(dx, dy)
                        widget.height += Math.max(dx, dy)
                    } else {
                        widget.width += Math.min(dx, dy)
                        widget.height += Math.min(dx, dy)
                    }
                } else {
                    widget.width += dx
                    widget.height += dy
                }
                widget.width = Math.max(16, widget.width)
                widget.height = Math.max(16, widget.height)
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