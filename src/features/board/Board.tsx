import {  useSelector } from "react-redux"
import styles from "./Board.module.css"
import { RootState } from "../../index"
import { WidgetsHolder } from "../widgets/WidgetsHolder"
import { BoardActions } from "./BoardActions"


export function Board() {
    const backgroundImage = useSelector((state: RootState) => state.board.backgroundImage)

    return (
        <div 
            className={styles.board}
        >
            <BoardActions />
            <img className={styles.background} src={backgroundImage} onDragStart={e => e.preventDefault()} alt=""/>
            <WidgetsHolder/>
        </div>
    )
}
