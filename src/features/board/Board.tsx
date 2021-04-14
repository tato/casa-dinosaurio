import { useDispatch, useSelector } from "react-redux"
import { selectDraggingAction, selectDraggingWidgetId, stopDragging } from "./boardSlice"
import styles from "./Board.module.css"
import React, { useCallback, useState } from "react"
import { getDraggingAction, unfocusWidget } from "../widgets/widgetsSlice"
import { RootState } from "../../index"
import { WidgetsHolder } from "../widgets/WidgetsHolder"
import { BoardActions } from "./BoardActions"


export function Board() {
    const backgroundImage = useSelector((state: RootState) => state.board.backgroundImage)

    const [lastMouseX, setLastMouseX] = useState(0);
    const [lastMouseY, setLastMouseY] = useState(0);
    
    const draggingWidgetId = useSelector(selectDraggingWidgetId)
    const draggingAction = useSelector(selectDraggingAction)

    const dispatch = useDispatch()

    const onMouseDown = () => dispatch(unfocusWidget())

    const onMouseMove = useCallback((event: React.MouseEvent) => {
        if (draggingWidgetId != null) {
            const dx = event.screenX - lastMouseX
            const dy = event.screenY - lastMouseY
            dispatch(getDraggingAction(draggingAction, draggingWidgetId, dx, dy))
        }

        setLastMouseX(event.screenX)
        setLastMouseY(event.screenY)
    }, [lastMouseX, lastMouseY, setLastMouseX, setLastMouseY, draggingWidgetId, draggingAction, dispatch])

    const onMouseUp = () => {
        dispatch(stopDragging())
    }


    return (
        <div 
            className={styles.board}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <BoardActions />
            <img className={styles.background} src={backgroundImage} onDragStart={e => e.preventDefault()} alt=""/>
            <WidgetsHolder/>
        </div>
    )
}
