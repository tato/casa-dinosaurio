
import { useDispatch, useSelector } from "react-redux"
import styles from "./Widget.module.css"
import { selectWidgetById, removeWidget, updateText } from "./widgetsSlice"
import circle from "./circle.svg"
import { EntityId } from "@reduxjs/toolkit"
import { RootState } from "../../index"
import React, { useState } from "react"
import { TextColorSelector } from "./TextColorSelector"

interface WidgetProps {
    widgetId: EntityId,
    setDraggingWidgetId: any,
    setDraggingAction: any,
}

export function Widget({widgetId, setDraggingWidgetId, setDraggingAction}: WidgetProps) {
    const [colorSelectorVisible, setColorSelectorVisible] = useState(false) // TODO! how about the token widget
    const [textColor, setTextColor] = useState("black") // TODO! how about the token widget
    const [textSize, setTextSize] = useState(16) // TODO! how about the token widget

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
    const onClickDelete = () => dispatch(removeWidget(widgetId))
    const onClickTextColor = () => setColorSelectorVisible(visible => !visible)
    const onClickTextSmaller = () => setTextSize(ts => ts - Math.floor(ts*0.2))
    const onClickTextBigger = () => setTextSize(ts => ts + Math.floor(ts*0.2))

    let content = null;
    if (widget.kind === "token") {
        content = <div className={styles.tokenDisplay} style={{backgroundImage: `url(${circle})`}} />
        
    } else if (widget.kind === "text") {
        const onTextAreaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
            if (e.target instanceof HTMLInputElement) {
                dispatch(updateText({widgetId, text: e.target.value}))
            }
        }
        const textAreaStyle = {
            color: textColor,
            fontSize: `${textSize}px`,
        }
        content = <textarea 
                defaultValue={widget.text} 
                onInput={onTextAreaInput} 
                style={textAreaStyle}>
            </textarea>
    }

    let textColorSelector = null;
    if (colorSelectorVisible === true) {
        textColorSelector = <div className={styles.textColorSelector}>
            <TextColorSelector onColorChange={setTextColor}/>
        </div>
    }

    let textWidgetControls = null;
    if (widget.kind === "text" ) {
        textWidgetControls = <>
            <div className={styles.draggableTextColor} onClick={onClickTextColor}>A</div>
            <div className={styles.draggableTextSmaller} onClick={onClickTextSmaller}>-</div>
            <div className={styles.draggableTextBigger} onClick={onClickTextBigger}>+</div>
        </>
    }

    return (
        <div className={styles.draggable} style={draggableStyle}>
            {/* <div className={styles.draggableMove} onMouseDown={e => onStartDrag(e, 'move')}>+</div>
            <div className={styles.draggableResize} onMouseDown={e => onStartDrag(e, 'resize')}>/</div>
            <div className={styles.draggableClose} onClick={onClickDelete}>x</div> */}

            <div className={styles.resizeNW} onMouseDown={e => onStartDrag(e, "resizeNW")}></div>
            <div className={styles.resizeNE} onMouseDown={e => onStartDrag(e, "resizeNE")}></div>
            <div className={styles.resizeSW} onMouseDown={e => onStartDrag(e, "resizeSW")}></div>
            <div className={styles.resizeSE} onMouseDown={e => onStartDrag(e, "resizeSE")}></div>
            <div className={styles.resizeN}  onMouseDown={e => onStartDrag(e, "resizeN")}></div>
            <div className={styles.resizeS}  onMouseDown={e => onStartDrag(e, "resizeS")}></div>
            <div className={styles.resizeW}  onMouseDown={e => onStartDrag(e, "resizeW")}></div>
            <div className={styles.resizeE}  onMouseDown={e => onStartDrag(e, "resizeE")}></div>

            { textWidgetControls }
            { textColorSelector }
            { content }
        </div>
    )
}

