import {html, render, TemplateResult} from "lit-html"
import {repeat} from "lit-html/directives/repeat.js"
import {renderDraggable, Draggable} from "./draggable"
import {casaUrl} from "./assets"

function uniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


const reader = new FileReader()
reader.addEventListener("load", function () {
    update(b => b.backgroundImage = reader.result.toString())
})
function loadImage() {
    document.getElementById("file-selector").click()
}
function loadImageFinished(e) {
    if (e.target.files.length > 0) {
        reader.readAsDataURL(e.target.files[0])
    }
}


function addToken() {
    const id = uniqueId()
    let widget: TokenWidget = {
        kind: "token",
        id: id,
        draggable: {
            id: id,
            proportional: true,
            x: 100, 
            y: 100, 
            width: 64,
            height: 64
        }
    }
    update(board => board.widgets[widget.id] = widget)
}
function addText() {
    const id = uniqueId()
    let widget: TextWidget = {
        kind: "text",
        id: id,
        text: "",
        draggable: {
            id: id,
            proportional: false,
            x: 100, 
            y: 100, 
            width: 256,
            height: 64
        }
    }
    update(board => board.widgets[widget.id] = widget)
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


function renderDraggableContent(d: Widget): TemplateResult {
    if (d.kind === "token") {
        return html` <div class="token-display" @dragstart="${e => e.preventDefault()}"></div>`
    }
    if (d.kind === "text") {
        return html`<input type="text" .value="${d.text}" @input="${e => d.text = e.target.value}">`
    }
}

function renderApp(board: Board): TemplateResult {
    return html`
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
            ${repeat(
                Object.values(board.widgets), 
                w => w.id, 
                w => renderDraggable(w.draggable, renderDraggableContent(w))
            )}
        </div>
    `
}



interface BaseWidget {
    id: string
    draggable: Draggable
}
interface TokenWidget extends BaseWidget {
    kind: "token"
}
interface TextWidget extends BaseWidget {
    kind: "text"
    text: string
}
type Widget = TokenWidget | TextWidget

interface Board {
    backgroundImage: string;
    widgets: { [id: string]: Widget }
}

let _board: Board = {
    backgroundImage: casaUrl,
    widgets: {}
}
let app = document.getElementById("app")
export function update(f: (b: Board) => void) {
    f(_board)
    render(renderApp(_board), app)
}
update(_ => {})