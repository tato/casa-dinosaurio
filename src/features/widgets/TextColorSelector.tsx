
import React, { useEffect, useState } from "react"
import styles from "./TextColorSelector.module.css"
const availableTextColors = [
    "black", "white", "red", "blue", "green", "pink"
]

export interface TextColorSelectorInterface {
    onColorChange: (color: string) => void,
    initialColor: string,
}

export function TextColorSelector({onColorChange, initialColor}: TextColorSelectorInterface) {
    const [ color, setColor ] = useState(initialColor)

    useEffect(() => {
        onColorChange(color)
    }, [color, onColorChange])

    let colorButtons = availableTextColors.map(color => {
        return <div 
                key={color}
                className={styles.colorButton} 
                style={{backgroundColor: color}}
                onClick={() => setColor(color)}
            ></div>
    })

    return (
        <div className={styles.container}>
            { colorButtons }
        </div>
    )
}
