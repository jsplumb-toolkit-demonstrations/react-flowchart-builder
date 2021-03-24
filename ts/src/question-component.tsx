import * as React from 'react';
import { BaseEditableComponent } from"./base-component";
import {PropsWithContext} from "@jsplumbtoolkit/react"

/**
 * Component used to render a Question node.
 */
export class QuestionComponent extends BaseEditableComponent<PropsWithContext, any> {

    constructor(props:any) {
        super(props);
    }

    render() {

        const obj = this.node.data;

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-question">
            <div style={{position:'relative'}}>

                <svg width={obj.w} height={obj.h}>
                    <path d={'M' +  (obj.w/2) + ' 10 L ' + (obj.w - 10) + ' ' +  (obj.h/2) + ' L ' + (obj.w/2) + ' ' + (obj.h - 10) + '  L 10 ' + (obj.h/2) + '  Z'} className="inner"/>
                    <text textAnchor="middle" x={obj.w/2} y={obj.h/2} dominantBaseline="central">{obj.text}</text>
                </svg>
            </div>
            <div className="node-edit node-action" onClick={this.edit.bind(this)}></div>
            <div className="node-delete node-action delete" onClick={this.remove.bind(this)}></div>
            <div className="drag-start connect"></div>
            <jtk-source port-type="source" filter=".connect"/>
            <jtk-target port-type="target"/>
        </div>
    }
}
