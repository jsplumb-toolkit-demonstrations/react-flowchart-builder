import * as React from 'react'
import {BaseNodeComponent} from "@jsplumbtoolkit/browser-ui-react"
import {BaseComponentProps} from "./base-component"

/**
 * Component used to render a start node. Note that this component extends the Toolkit's BaseNodeComponent, whereas the others
 * extend the 'BaseEditableComponent' - the other node types can have their labels edited, or be removed, and this node type cannot.
 */
export class StartComponent extends BaseNodeComponent<BaseComponentProps, any> {

    constructor(props:BaseComponentProps) {
        super(props)
    }

    render() {

        const obj = this.node.data;

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-start">
            <svg width={obj.w} height={obj.h}>
                <ellipse cx={obj.w / 2} cy={obj.h / 2} rx={(obj.w /2) - 10} ry={(obj.h/2) - 10} className="inner"/>
            </svg>
            <span>{obj.text}</span>
            <div className="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
        </div>
    }
}
