import * as React from 'react'
import * as ReactDOM from "react-dom"

import * as SyntaxHighlighter from "@jsplumb/json-syntax-highlighter"
import {BrowserUI, Surface} from "@jsplumbtoolkit/browser-ui"
import {ToolkitSyntaxHighlighter} from "@jsplumb/json-syntax-highlighter"
import { PropsWithContext } from "@jsplumbtoolkit/react"

export interface DatasetProps extends PropsWithContext {
    surface:Surface
}

export class DatasetComponent extends React.Component<any, any> {

    toolkit:BrowserUI
    syntaxHighlighter:ToolkitSyntaxHighlighter

    constructor(props:any) {
        super(props)
    }

    render() {
        return <div className="jtk-demo-dataset"></div>
    }

    initialize(surface:Surface) {
        SyntaxHighlighter.newInstance(surface.toolkitInstance, ReactDOM.findDOMNode(this) as Element)
    }

    componentDidMount() {
        if (this.props.surface != null) {
            this.initialize(this.props.surface)
        }
    }
}
