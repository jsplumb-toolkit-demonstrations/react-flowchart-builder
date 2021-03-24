import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { JsPlumbToolkitMiniviewComponent, JsPlumbToolkitSurfaceComponent }  from '@jsplumbtoolkit/react'
import {BrowserUI, ready, newInstance, Surface, DrawingToolsPlugin} from '@jsplumbtoolkit/browser-ui'
import * as Dialogs from "@jsplumbtoolkit/dialogs"
import {Edge, uuid, Vertex} from "@jsplumbtoolkit/core"
import * as ConnectorEditors from "@jsplumbtoolkit/connector-editors"

import { QuestionComponent } from './question-component';
import { ActionComponent } from './action-component';
import { OutputComponent } from './output-component';
import { StartComponent } from './start-component';

import DragDropNodeSource from './drag-drop-node-source';

import { ControlsComponent } from './controls-component';
import { DatasetComponent } from './dataset-component';

import {EdgePathEditor} from "@jsplumbtoolkit/connector-editors"

ready(() => {

    const mainElement = document.querySelector("#jtk-demo-flowchart"),
        nodePaletteElement = mainElement.querySelector(".node-palette");

// ------------------------- dialogs ------------------------------------------------------------

    const dialogs = Dialogs.createDialogManager({
        selector: ".dlg"
    })

    class DemoComponent extends React.Component {

        toolkit:BrowserUI
        view:any
        surface:Surface
        controls:any
        pathEditor:EdgePathEditor
        renderParams:any

        constructor(props:any) {
            super(props)
            this.toolkit = newInstance({
                nodeFactory: (type:string, data:Record<string, any>, callback:Function) => {
                    dialogs.show({
                        id: "dlgText",
                        title: "Enter " + type + " name:",
                        onOK:  (d:Record<string, any>) => {
                            data.text = d.text;
                            // if the user entered a name...
                            if (data.text) {
                                // and it was at least 2 chars
                                if (data.text.length >= 2) {
                                    // set an id and continue.
                                    data.id = uuid();
                                    callback(data);
                                }
                                else
                                // else advise the user.
                                    alert(type + " names must be at least 2 characters!");
                            }
                            // else...do not proceed.
                        }
                    });
                    return true
                },
                beforeStartConnect:(source:Vertex, edgeType:string) => {
                    // limit edges from start node to 1. if any other type of node, return
                    return (source.data.type === "start" && source.getEdges().length > 0) ? false : { label:"..." }
                }
            });

            this.view = {
                nodes: {
                    "start": {
                       jsx:(ctx:any) => { return <StartComponent ctx={ctx} /> }
                    },
                    "selectable": {
                        events: {
                            tap:  (params:any) => {
                                this.toolkit.toggleSelection(params.node);
                            }
                        }
                    },
                    "question": {
                        parent: "selectable",
                        jsx:(ctx:any) => { return <QuestionComponent ctx={ctx} /> }
                    },
                    "action": {
                        parent: "selectable",
                        jsx:(ctx:any) => { return <ActionComponent ctx={ctx} /> }
                    },
                    "output":{
                        parent:"selectable",
                        jsx:(ctx:any) => { return <OutputComponent ctx={ctx} /> }
                    }
                },
                // There are two edge types defined - 'yes' and 'no', sharing a common
                // parent.
                edges: {
                    "default": {
                        anchor:"AutoDefault",
                        endpoint:"Blank",
                        connector: { type:"Orthogonal", options:{ cornerRadius: 5 } },
                        paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
                        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
                        events: {
                            "dblclick":  (params:any) => {
                                dialogs.show({
                                    id: "dlgConfirm",
                                    data: {
                                        msg: "Delete Edge"
                                    },
                                    onOK: () => {
                                        this.toolkit.removeEdge(params.edge)
                                    }
                                })
                            },
                            "click": (params:any) => {
                                this.pathEditor.startEditing(params.edge, {})
                            }
                        },
                        overlays: [
                            { type:"Arrow", options:{ location: 1, width: 10, length: 10 }},
                            { type:"Arrow", options:{ location: 0.3, width: 10, length: 10 }}
                        ]
                    },
                    "connection":{
                        parent:"default",
                        overlays:[
                            {
                                type: "Label",
                                options:{
                                    label: "${label}",
                                    events:{
                                        click:(params:any) => {
                                            this._editLabel(params.edge);
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                ports: {
                    "start": {
                        edgeType: "default"
                    },
                    "source": {
                        maxConnections: -1,
                            edgeType: "connection"
                    },
                    "target": {
                        maxConnections: -1,
                            isTarget: true,
                            dropOptions: {
                            hoverClass: "connection-drop"
                        }
                    }
                }
            };

            this.renderParams = {
                // Layout the nodes using an absolute layout
                layout: {
                    type: "Absolute"
                },
                events: {
                    canvasClick: (e:Event) => {
                        this.toolkit.clearSelection()
                        this.pathEditor.stopEditing()
                    },
                    edgeAdded:(params:{edge:Edge, addedByMouse?:boolean}) => {
                        if (params.addedByMouse) {
                            this._editLabel(params.edge, true);
                        }
                    }
                },
                lassoInvert:true,
                consumeRightClick: false,
                dragOptions: {
                    filter: ".jtk-draw-handle, .node-action, .node-action i"
                },
                zoomToFit:true,
                plugins:[
                    DrawingToolsPlugin.type
                ]
            };
        }

        render() {
            return <div style={{width:"100%",height:"100%",display:"flex"}}>
                        <JsPlumbToolkitSurfaceComponent renderParams={this.renderParams} toolkit={this.toolkit} view={this.view} ref={ (c:any) => this.surface = c.surface }/>
                        <ControlsComponent ref={(c) => this.controls = c }/>
                        <div className="miniview"/>                        
                    </div>
        }

        dataGenerator (el:Element) {
            return {
                w:120,
                h:120,
                type:el.getAttribute("data-node-type")
            }
        }

        componentDidMount() {

            this.pathEditor = ConnectorEditors.newInstance(this.surface)

            this.toolkit.load({url:"../data/copyright.json"})
            this.controls.initialize(this.surface)

            ReactDOM.render(
                <DragDropNodeSource
                    surface={this.surface}
                    selector={"div"}
                    container={nodePaletteElement}
                    dataGenerator={this.dataGenerator}
                />
                , nodePaletteElement);

            ReactDOM.render(
                <JsPlumbToolkitMiniviewComponent surface={this.surface}/>, document.querySelector(".miniview")
            );

            ReactDOM.render(
                <DatasetComponent surface={this.surface}/>, document.querySelector(".dataset-placeholder")
            );
        }

        _editLabel (edge:Edge, deleteOnCancel?:boolean) {
            dialogs.show({
                id: "dlgText",
                data: {
                    text: edge.data.label || ""
                },
                onOK: (data) => {
                    this.toolkit.updateEdge(edge, { label:data.text || "" });
                },
                onCancel:() => {
                    if (deleteOnCancel) {
                        this.toolkit.removeEdge(edge);
                    }
                }
            })
        }
    }        

    ReactDOM.render(<DemoComponent/>, document.querySelector(".jtk-demo-canvas"))

});
