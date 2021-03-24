import * as React from 'react'
import {BaseNodeComponent, PropsWithContext} from "@jsplumbtoolkit/react"

/**
 * Component used to render a start node. Note that this component extends the Toolkit's BaseNodeComponent, whereas the others
 * extend the 'BaseEditableComponent' - the other node types can have their labels edited, or be removed, and this node type cannot.
 */
export class StartComponent extends BaseNodeComponent<PropsWithContext, any> {

    constructor(props:any) {
        super(props)
    }

    render() {

        const obj = this.node.data;

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-start">
            <div style={{position:'relative'}}>
                <svg width={obj.w} height={obj.h}>
                    <ellipse cx={obj.w / 2} cy={obj.h / 2} rx={(obj.w /2) - 10} ry={(obj.h/2) - 10} className="inner"/>
                    <text textAnchor="middle" x={obj.w / 2} y={ obj.h / 2 } dominantBaseline="central">{obj.text}</text>
                </svg>
            </div>
            <div className="drag-start connect"></div>
            <jtk-source port-type="start" filter=".outer" filter-negate="true"/>
        </div>
    }
}
