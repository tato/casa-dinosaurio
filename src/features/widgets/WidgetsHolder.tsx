import { useDispatch, useSelector } from "react-redux"
import { dragWidget, removeWidget, selectDraggingWidgetId, selectFocusedWidgetId, selectWidgetIds, stopDragging } from "./widgetsSlice"
import { Widget } from "./Widget"
import React, { useEffect } from "react";
import { WidgetTrash } from "../board/WidgetTrash";

let lastMouseX = 0
let lastMouseY = 0

export function WidgetsHolder() {
    
    const widgets = useSelector(selectWidgetIds)
    const focusedWidgetId = useSelector(selectFocusedWidgetId)
    const draggingWidgetId = useSelector(selectDraggingWidgetId)

    const dispatch = useDispatch()

    useEffect(() => {
        function onMouseMove(event: MouseEvent) {
            if (draggingWidgetId != null) {
                const dx = event.screenX - lastMouseX
                const dy = event.screenY - lastMouseY
                dispatch(dragWidget({widgetId: draggingWidgetId, dx, dy }))
            }
    
            lastMouseX = event.screenX
            lastMouseY = event.screenY
        }
        document.addEventListener("mousemove", onMouseMove)
        return function() {
            document.removeEventListener("mousemove", onMouseMove)
        }
    }, [draggingWidgetId, dispatch])

    useEffect(() => {
        function onMouseUp() {
            dispatch(stopDragging())
        }
        document.addEventListener("mouseup", onMouseUp)
        return function() {
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [dispatch])

    const widgetTrashOnMouseUp = () => {
        dispatch(removeWidget(draggingWidgetId))
    }

    let widgetTrash = null
    if (draggingWidgetId != null) {
        widgetTrash = <WidgetTrash onMouseUp={widgetTrashOnMouseUp} />
    }

    const renderedWidgets = widgets.map(widgetId => (
        <Widget key={widgetId} widgetId={widgetId} focused={focusedWidgetId === widgetId}/>
    ))

    return (
        <>
            {renderedWidgets}
            { widgetTrash }
        </>
    )
}
