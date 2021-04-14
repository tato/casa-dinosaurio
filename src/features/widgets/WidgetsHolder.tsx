import { useSelector } from "react-redux"
import { selectFocusedWidgetId, selectWidgetIds } from "./widgetsSlice"
import { Widget } from "./Widget"


export function WidgetsHolder() {

    const widgets = useSelector(selectWidgetIds)
    const focusedWidgetId = useSelector(selectFocusedWidgetId) 

    const renderedWidgets = widgets.map(widgetId => (
        <Widget key={widgetId} widgetId={widgetId} focused={focusedWidgetId === widgetId}/>
    ))

    return (
        <>
            {renderedWidgets}
        </>
    )
}
