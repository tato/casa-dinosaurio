import { useDispatch, useSelector } from "react-redux"
import { resizeWidget, selectWidgetIds } from "./widgetsSlice"
import { Widget } from "./Widget"
import styles from "./WidgetsHolder.module.css"
import React, { useCallback, useState } from "react"
import { moveWidget } from "./widgetsSlice"


export function WidgetsHolder() {
    const [lastMouseX, setLastMouseX] = useState(0)
    const [lastMouseY, setLastMouseY] = useState(0)
    const [draggingWidgetId, setDraggingWidgetId] = useState(null)
    const [draggingAction, setDraggingAction] = useState("move")

    const dispatch = useDispatch()

    const widgets = useSelector(selectWidgetIds)
    const renderedWidgets = widgets.map(widgetId => (
        <Widget 
            key={widgetId} 
            widgetId={widgetId} 
            setDraggingWidgetId={setDraggingWidgetId}
            setDraggingAction={setDraggingAction}/>
    ))

    const onMouseMove = useCallback((event: React.MouseEvent) => {
        if (draggingWidgetId != null) {
            const dx = event.screenX - lastMouseX
            const dy = event.screenY - lastMouseY
            
            if (draggingAction === "move") {
                dispatch(moveWidget({widgetId: draggingWidgetId, dx, dy}))
            } else if (draggingAction.startsWith("resize")) {
                const direction = draggingAction.substring(6)
                dispatch(resizeWidget({widgetId: draggingWidgetId, dx, dy, direction}))
            }
        }

        setLastMouseX(event.screenX)
        setLastMouseY(event.screenY)
    }, [lastMouseX, lastMouseY, draggingWidgetId, draggingAction, dispatch])


    const onMouseUp = useCallback(() => {
        setDraggingWidgetId(null)
    }, [setDraggingWidgetId])

    return (
        <div className={styles.widgetsHolder} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
            {renderedWidgets}
        </div>
    )
}
