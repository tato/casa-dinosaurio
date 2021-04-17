import { useDispatch, useSelector } from "react-redux"
import { dragWidget, removeWidget, selectDraggingWidgetId, selectFocusedWidgetId, selectWidgetIds, stopDragging } from "./widgetsSlice"
import { Widget } from "./Widget"
import React, { useEffect } from "react";
import { WidgetTrash } from "../board/WidgetTrash";


export function WidgetsHolder() {
    
    const widgets = useSelector(selectWidgetIds)
    const focusedWidgetId = useSelector(selectFocusedWidgetId)
    const draggingWidgetId = useSelector(selectDraggingWidgetId)

    const dispatch = useDispatch()

    useEffect(() => {
        function onMouseMove(event: MouseEvent) {
            if (draggingWidgetId != null) {
                dispatch(dragWidget({
                    widgetId: draggingWidgetId, 
                    dx: event.movementX, 
                    dy: event.movementY 
                }))
            }
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
