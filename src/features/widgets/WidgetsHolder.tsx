import { useSelector } from "react-redux"
import { selectWidgetIds } from "./widgetsSlice"
import { Widget } from "./Widget"


export function WidgetsHolder() {

    const widgets = useSelector(selectWidgetIds)
    const renderedWidgets = widgets.map(widgetId => (
        <Widget key={widgetId} widgetId={widgetId}/>
    ))


    return (
        <>
            {renderedWidgets}
        </>
    )
}
