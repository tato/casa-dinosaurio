import {html} from "lit-html"
import {styleMap} from "lit-html/directives/style-map"
import {update} from "./index.js"

export function renderDraggable({options, slot}) {
    const opt = options;

    const style = { 
        top: `${opt.y}px`, left: `${opt.x}px`,
        width: `${opt.width}px`, height: `${opt.height}px`,
    }

    return html`
        <div class="draggable" id="${opt.id}" style="${styleMap(style)}">
            <div class="draggable-move" @mousedown="${e => startDrag(e, 'move')}">+</div>
            <div class="draggable-resize" @mousedown="${e => startDrag(e, 'resize')}">/</div>
            <div class="draggable-close" @click="${deleteDraggable}">x</div>
            ${slot}
        </div>
    `
}

let lastMouseX = 0
let lastMouseY = 0
let draggingId = null
let draggingAction = null


function startDrag(e, action) {
    e.preventDefault()
    lastMouseX = e.screenX
    lastMouseY = e.screenY
    document.onmousemove = handleDrag
    document.onmouseup = endDrag
    draggingId = e.target.closest(".draggable").id
    draggingAction = action
}


function endDrag(e) {
    e.preventDefault()
    document.onmouseup = null
    document.onmousemove = null
}


function handleDrag(e) {
    e.preventDefault()
    const dx = e.screenX - lastMouseX
    const dy = e.screenY - lastMouseY
    if (draggingAction === "move") {
        dragMove(dx, dy)
    } else if (draggingAction === "resize") {
        dragResize(dx, dy)
    }
    lastMouseX = e.screenX
    lastMouseY = e.screenY
}


function dragMove(dx, dy) {
    update(board => {
        board.draggables[draggingId].x += dx
        board.draggables[draggingId].y += dy
    })
}


function dragResize(dx, dy) {
    update(board => {
        let it = board.draggables[draggingId]
        if (it.proportional) {
            if (dx >= 0 && dy >= 0) {
                it.width += Math.max(dx, dy)
                it.height += Math.max(dx, dy)
            } else {
                it.width += Math.min(dx, dy)
                it.height += Math.min(dx, dy)
            }
        } else {
            it.width += dx
            it.height += dy
        }
        it.width = Math.max(16, it.width)
        it.height = Math.max(16, it.height)
    })
}


function deleteDraggable(e) {
    const id = e.target.closest(".draggable").id
    update(board => delete board.draggables[id])
}
