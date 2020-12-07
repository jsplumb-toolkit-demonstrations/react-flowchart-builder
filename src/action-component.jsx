import React from 'react';
import { BaseEditableComponent } from"./base-component.jsx";

/**
 * Component used to render an action node.
 */
export class ActionComponent extends BaseEditableComponent {

    constructor(props) {
        super(props)
    }

    render() {

        const obj = this.node.data;

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-action">
            <div style={{position:'relative'}}>
                <svg width={obj.w} height={obj.h}>
                    <rect x={10} y={10} width={obj.w-20} height={obj.h-20} className="inner"/>
                    <text textAnchor="middle" x={obj.w/2} y={obj.h/2} dominantBaseline="central">{obj.text}</text>
                </svg>
            </div>
            <div className="node-edit node-action" onClick={this.edit.bind(this)}></div>
            <div className="node-delete node-action" onClick={this.remove.bind(this)}></div>
            <div className="drag-start connect"></div>
            <jtk-target port-type="target"/>
            <jtk-source port-type="source" filter=".connect"/>
        </div>
    }
}
