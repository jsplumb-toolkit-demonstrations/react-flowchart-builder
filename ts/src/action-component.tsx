import * as React from 'react'

import {Node} from "@jsplumbtoolkit/browser-ui"

import {BaseComponentProps, BaseEditableComponent} from "./base-component"

export interface ActionProps extends BaseComponentProps {}
export interface ActionState {}

/**
 * Component used to render an action node.
 */
export class ActionComponent extends BaseEditableComponent<ActionProps, ActionState> {

    node:Node

    constructor(props:ActionProps) {
        super(props)
    }

    render() {

        const obj = this.node.data

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-action" data-jtk-target="true" data-jtk-port-type="target">
            <svg width={obj.w} height={obj.h}>
                <rect x={10} y={10} width={obj.w-20} height={obj.h-20} className="inner" rx={5} ry={5}/>
            </svg>
            <span>{obj.text}</span>
            <div className="node-edit node-action" onClick={this.edit.bind(this)}></div>
            <div className="node-delete node-action" onClick={this.remove.bind(this)}></div>
            <div className="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
        </div>
    }
}
