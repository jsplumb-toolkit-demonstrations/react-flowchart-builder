import * as React from 'react';
import {BaseComponentProps, BaseEditableComponent} from "./base-component"

/**
 * Component used to render a Question node.
 */
export class QuestionComponent extends BaseEditableComponent<BaseComponentProps, any> {

    constructor(props:BaseComponentProps) {
        super(props)
    }

    render() {

        const obj = this.node.data;

        return <div style={{width:obj.w + 'px', height:obj.h + 'px'}} className="flowchart-object flowchart-question" data-jtk-target="true" data-jtk-port-type="target">
            <svg width={obj.w} height={obj.h}>
                <path d={'M' +  (obj.w/2) + ' 10 L ' + (obj.w - 10) + ' ' +  (obj.h/2) + ' L ' + (obj.w/2) + ' ' + (obj.h - 10) + '  L 10 ' + (obj.h/2) + '  Z'} className="inner"/>
            </svg>
            <span>{obj.text}</span>
            <div className="node-edit node-action" onClick={this.edit.bind(this)}></div>
            <div className="node-delete node-action delete" onClick={this.remove.bind(this)}></div>
            <div className="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
        </div>
    }
}
