import * as React from 'react'
import { BaseEditableComponent } from"./base-component"
import {PropsWithContext} from "@jsplumbtoolkit/react"

/**
 * Component used to render an output node.
 */
export class OutputComponent extends BaseEditableComponent<PropsWithContext, any> {

    constructor(props:any) {
        super(props)
    }

    render() {

        const obj = this.node.data;

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-output">
            <div style={{position:'relative'}}>
                <svg width={obj.w} height={obj.h}>
                    <rect x={0} y={0} width={obj.w} height={obj.h}/>
                    <text textAnchor="middle" x={obj.w/2} y={obj.h/2} dominantBaseline="central">{obj.text}</text>
                </svg>
            </div>
            <div className="node-edit node-action" onClick={this.edit.bind(this)}></div>
            <div className="node-delete node-action" onClick={this.remove.bind(this)}></div>
            <jtk-target port-type="target"/>
        </div>
    }
}
