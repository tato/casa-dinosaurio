import {html, render} from 'lit-html'
import {repeat} from 'lit-html/directives/repeat.js'
import {styleMap} from 'lit-html/directives/style-map.js'

import casa from "./casa.jpg"

function uniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


const reader = new FileReader()
reader.addEventListener("load", function () {
    update(b => b.backgroundImage = reader.result)
})
function loadImage() {
    document.getElementById("file-selector").click()
}
function loadImageFinished(e) {
    if (e.target.files.length > 0) {
        reader.readAsDataURL(e.target.files[0])
    }
}

const draggableTemplate = d => {
    const style = { 
        top: `${d.y}px`, left: `${d.x}px`,
        width: `${d.width}px`, height: `${d.height}px`,
    }
    
    let slot = null;
    if (d.type === "token") {
        slot = html` <div class="token-display" @dragstart="${e => e.preventDefault()}"></div>`
    }
    if (d.type === "text") {
        slot = html`<input type="text" .value="${d.text}">`
    }

    return html`
        <div class="draggable" id="${d.id}" style="${styleMap(style)}">
            <div class="draggable-move" @mousedown="${e => startDrag(e, 'move')}">+</div>
            <div class="draggable-resize" @mousedown="${e => startDrag(e, 'resize')}">/</div>
            ${slot}
        </div>
    `
}

function addToken() {
    let draggable = { id: uniqueId(), proportional: true, type: "token", x: 100, y: 100, width: 64, height: 64 }
    update(board => board.draggables[draggable.id] = draggable)
}
function addText() {
    let draggable = { id: uniqueId(), proportional: false, type: "text", x: 100, y: 100, width: 256, height: 64 }
    update(board => board.draggables[draggable.id] = draggable)
}

function exportBoard() {
    let serialized = JSON.stringify(_board)

    let a = document.createElement("a");
    a.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(serialized))
    a.setAttribute("download", "board.dinosaurio")
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
function importBoard() {
    document.getElementById("import-file-selector").click()
}
function loadImportFinished(e) {
    if (e.target.files.length > 0) {
        e.target.files[0].text().then(function(text) {
            let data = JSON.parse(text)
            update(_ => _board = data)
        })
    }
}


const appTemplate = board => html`
    <div id="actions">
        <input type="file" id="file-selector" accept=".jpg, .jpeg, .png" @change="${loadImageFinished}" style="display: none;">
        <button type="button" @click="${loadImage}">Load Image</button>
        <button type="button" @click="${addToken}">Add Token</button>
        <button type="button" @click="${addText}">Add Text</button>
        <button type="button" @click="${exportBoard}">Export</button>
        <input type="file" id="import-file-selector" accept=".dinosaurio" @change="${loadImportFinished}" style="display: none;">
        <button type="button" @click="${importBoard}">Import</button>
    </div>
    <img id="background" src="${board.backgroundImage}" ondragstart="return false">
    <div id="draggable-container">
        ${repeat(Object.values(board.draggables), d => d.id, draggableTemplate)}
    </div>
`


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



let _board = { }
let app = document.getElementById("app")
function update(f) {
    f(_board)
    render(appTemplate(_board), app)
}
update(b => {
    b.backgroundImage = casa
    b.draggables = {}
})