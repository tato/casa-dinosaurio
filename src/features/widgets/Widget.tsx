
import { useDispatch, useSelector } from "react-redux"
import styles from "./Widget.module.css"
import { selectWidgetById, removeWidget, updateText } from "./widgetsSlice"
import circle from "./circle.svg"
import { EntityId } from "@reduxjs/toolkit"
import { RootState } from "../../index"
import React from "react"

interface WidgetProps {
    widgetId: EntityId,
    setDraggingWidgetId: any,
    setDraggingAction: any,
}

export function Widget({widgetId, setDraggingWidgetId, setDraggingAction}: WidgetProps) {
    const widget = useSelector((state: RootState) => selectWidgetById(state, widgetId))
    const dispatch = useDispatch()

    if (!widget) return <div></div>

    let draggableStyle = { 
        top: `${widget.y}px`, left: `calc(50% + ${widget.x}px)`,
        width: `${widget.width}px`, height: `${widget.height}px`,
    }

    function onStartDrag(e: React.MouseEvent, action: string) {
        e.preventDefault()
    
        if (e.target instanceof Element) {
            setDraggingWidgetId(widgetId)
            setDraggingAction(action)
        }
    }
    
    function onClickDelete() {
        dispatch(removeWidget(widgetId))
    }

    let content = null;
    if (widget.kind === "token") {
        content = <div className={styles.tokenDisplay} style={{backgroundImage: `url(${circle})`}} />
        
    } else if (widget.kind === "text") {
        const onWidgetInput = (e: React.FormEvent<HTMLInputElement>) => {
            if (e.target instanceof HTMLInputElement) {
                dispatch(updateText({widgetId, text: e.target.value}))
            }
        }
        content = <input type="text" 
            value={widget.text} 
            onInput={onWidgetInput} />
    }

    return (
        <div className={styles.draggable} style={draggableStyle}>
            <div className={styles.draggableMove} onMouseDown={e => onStartDrag(e, 'move')}>+</div>
            <div className={styles.draggableResize} onMouseDown={e => onStartDrag(e, 'resize')}>/</div>
            <div className={styles.draggableClose} onClick={onClickDelete}>x</div>
            { content }
        </div>
    )
}

