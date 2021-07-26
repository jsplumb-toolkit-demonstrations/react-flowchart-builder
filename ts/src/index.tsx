import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { JsPlumbToolkitMiniviewComponent, JsPlumbToolkitSurfaceComponent, BrowserUIReact }  from '@jsplumbtoolkit/browser-ui-react'
import { ArrowOverlay, BlankEndpoint, LabelOverlay } from "@jsplumb/core"
import { AnchorLocations } from "@jsplumb/common"
import {Surface, EVENT_CANVAS_CLICK, EVENT_CLICK, EVENT_DBL_CLICK, EVENT_TAP } from '@jsplumbtoolkit/browser-ui'
import * as Dialogs from "@jsplumbtoolkit/dialogs"
import {Edge, Vertex, EVENT_EDGE_ADDED, AbsoluteLayout, Node, uuid, ObjectData} from "@jsplumbtoolkit/core"

import * as ConnectorEditors from "@jsplumbtoolkit/connector-editors"

import * as OrthogonalConnectorEditor from "@jsplumbtoolkit/connector-editors-orthogonal"

import { OrthogonalConnector } from "@jsplumbtoolkit/connector-orthogonal"
import { DrawingToolsPlugin } from "@jsplumbtoolkit/browser-ui-plugin-drawing-tools"


import { QuestionComponent } from './question-component'
import { ActionComponent } from './action-component'
import { OutputComponent } from './output-component'
import { StartComponent } from './start-component'

import DragDropNodeSource from './drag-drop-node-source'

import { ControlsComponent } from './controls-component'

import {EdgePathEditor} from "@jsplumbtoolkit/connector-editors"
import {LassoPlugin} from "@jsplumbtoolkit/browser-ui-plugin-lasso"
import {CancelFunction, CommitFunction} from "@jsplumbtoolkit/dialogs"

OrthogonalConnectorEditor.initialize()

const START = "start"
const OUTPUT = "output"
const ACTION = "action"
const QUESTION = "question"
const SELECTABLE = "selectable"
const DEFAULT = "default"
const SOURCE = "source"
const TARGET = "target"
const RESPONSE = "response"

    const mainElement = document.querySelector("#jtk-demo-flowchart"),
        nodePaletteElement = mainElement.querySelector(".node-palette");

// ------------------------- dialogs ------------------------------------------------------------

    const dialogs = Dialogs.newInstance({
        dialogs: {
            dlgText: [
                '<input type="text" size="50" jtk-focus jtk-att="text" value="${text}" jtk-commit="true"/>',
                'Enter Text',
                true

            ],
            dlgConfirm: [
                '${msg}',
                'Please Confirm',
                true
            ],
            dlgMessage: [
                '${msg}',
                'Message',
                false
            ]
        }
    })

    const dialogManager = {
        showEdgeLabelDialog: (data: ObjectData, callback: Function, abort: CancelFunction) => {
            dialogs.show({
                id: 'dlgText',
                data: {
                    text: data.label || ''
                },
                onOK: (d: any) => {
                    callback({label: d.text || ''})
                },
                onCancel: abort
            })
        },
        confirmDelete:(data:ObjectData, callback:CommitFunction) => {
            dialogs.show({
                id: "dlgConfirm",
                data: {
                    msg: `Delete '${data.text}'?`
                },
                onOK: callback
            });
        },
        editName:(data:ObjectData, callback:CommitFunction) => {
            dialogs.show({
                id: "dlgText",
                data: data,
                title: "Edit " + data.type + " name",
                onOK:  callback
            });
        }
    }

    class DemoComponent extends React.Component {

        toolkit:BrowserUIReact
        view:any
        surface:Surface
        controls:any
        pathEditor:EdgePathEditor
        renderParams:any

        constructor(props:any) {
            super(props)
            this.toolkit = new BrowserUIReact({
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
                    return (source.data.type === START && source.getEdges().length > 0) ? false : { label:"..." }
                },
                edgeFactory: (type: string, data: Record<string, any>, continueCallback: CommitFunction, abortCallback: CancelFunction):boolean => {
                    this.showEdgeLabelDialog(data, continueCallback, abortCallback)
                    return true
                }
            });

            this.view = {
                nodes: {
                    [START]: {
                       jsx:(ctx:any) => { return <StartComponent ctx={ctx} dlg={dialogManager}/> }
                    },
                    [SELECTABLE]: {
                        events: {
                            [EVENT_TAP]:  (params:{obj:Node}) => {
                                this.toolkit.toggleSelection(params.obj);
                            }
                        }
                    },
                    [QUESTION]: {
                        parent: SELECTABLE,
                        jsx:(ctx:any) => { return <QuestionComponent ctx={ctx} dlg={dialogManager}/> }
                    },
                    [ACTION]: {
                        parent: SELECTABLE,
                        jsx:(ctx:any) => { return <ActionComponent ctx={ctx} dlg={dialogManager}/> }
                    },
                    [OUTPUT]:{
                        parent:SELECTABLE,
                        jsx:(ctx:any) => { return <OutputComponent ctx={ctx} dlg={dialogManager}/> }
                    }
                },
                // There are two edge types defined - 'yes' and 'no', sharing a common
                // parent.
                edges: {
                    [DEFAULT]: {
                        anchor:AnchorLocations.AutoDefault,
                        endpoint:BlankEndpoint.type,
                        connector: { type:OrthogonalConnector.type, options:{ cornerRadius: 5 } },
                        paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
                        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
                        events: {
                            [EVENT_DBL_CLICK]:  (params:any) => {
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
                            [EVENT_CLICK]: (params:any) => {
                                this.pathEditor.startEditing(params.edge, {})
                            }
                        },
                        overlays: [
                            { type:ArrowOverlay.type, options:{ location: 1, width: 10, length: 10 }},
                            { type:ArrowOverlay.type, options:{ location: 0.3, width: 10, length: 10 }}
                        ]
                    },
                    [RESPONSE]:{
                        parent:DEFAULT,
                        overlays:[
                            {
                                type: LabelOverlay.type,
                                options:{
                                    label: "${label}",
                                    events:{
                                        click:(params:{edge:Edge}) => {
                                            this._editLabel(params.edge);
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                ports: {
                    [START]: {
                        edgeType: DEFAULT
                    },
                    [SOURCE]: {
                        maxConnections: -1,
                        edgeType: RESPONSE
                    },
                    [TARGET]: {
                        maxConnections: -1,
                        isTarget: true
                    }
                }
            };

            this.renderParams = {
                // Layout the nodes using an absolute layout
                layout: {
                    type: AbsoluteLayout.type
                },
                events: {
                    [EVENT_CANVAS_CLICK]: (e:Event) => {
                        this.toolkit.clearSelection()
                        this.pathEditor.stopEditing()
                    }
                },
                lassoInvert:true,
                consumeRightClick: false,
                dragOptions: {
                    filter: ".jtk-draw-handle, .node-action, .node-action i"
                },
                zoomToFit:true,
                plugins:[
                    DrawingToolsPlugin.type, LassoPlugin.type
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

        }

        showEdgeLabelDialog(data:ObjectData, callback:CommitFunction, abort:CancelFunction) {
            dialogs.show({
                id: "dlgText",
                data: {
                    text: data.label || ""
                },
                onOK: (data:ObjectData) => callback({label: data.text || ''}),
                onCancel:abort
            })
        }

        _editLabel (edge:Edge, deleteOnCancel?:boolean) {
            this.showEdgeLabelDialog(edge.data, (data) => {
                this.toolkit.updateEdge(edge, { label:data.text || "" });
            }, () => {
                if (deleteOnCancel) {
                    this.toolkit.removeEdge(edge);
                }
            })
        }
    }        

    ReactDOM.render(<DemoComponent/>, document.querySelector(".jtk-demo-canvas"))

