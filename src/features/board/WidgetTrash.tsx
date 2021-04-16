import styles from "./WidgetTrash.module.css"

interface WidgetTrashProps {
    onMouseUp: (event: React.MouseEvent) => void
}

export function WidgetTrash({onMouseUp}: WidgetTrashProps) {
    return (
        <div className={styles.widgetTrash} onMouseUp={onMouseUp}>
            T
        </div>
    )
}