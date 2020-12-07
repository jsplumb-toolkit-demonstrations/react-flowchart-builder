import React from 'react';
import ReactDOM from 'react-dom';

import { JsPlumbToolkitMiniviewComponent, JsPlumbToolkitSurfaceComponent }  from 'jsplumbtoolkit-react';
import { jsPlumbToolkit, Dialogs } from 'jsplumbtoolkit';

import { QuestionComponent } from './question-component.jsx';
import { ActionComponent } from './action-component.jsx';
import { OutputComponent } from './output-component.jsx';
import { StartComponent } from './start-component.jsx';

import DragDropNodeSource from './drag-drop-node-source.jsx';

import { ControlsComponent } from './controls-component.jsx';
import { DatasetComponent } from './dataset-component.jsx';

import "jsplumbtoolkit-editable-connectors";

jsPlumbToolkit.ready(() => {

    const mainElement = document.querySelector("#jtk-demo-flowchart"),
        nodePaletteElement = mainElement.querySelector(".node-palette");

// ------------------------- dialogs ------------------------------------------------------------

    Dialogs.initialize({
        selector: ".dlg"
    });

    class DemoComponent extends React.Component {

        constructor(props) {
            super(props);
            this.toolkit = jsPlumbToolkit.newInstance({
                nodeFactory: function (type, data, callback) {
                    Dialogs.show({
                        id: "dlgText",
                        title: "Enter " + type + " name:",
                        onOK:  (d) => {
                            data.text = d.text;
                            // if the user entered a name...
                            if (data.text) {
                                // and it was at least 2 chars
                                if (data.text.length >= 2) {
                                    // set an id and continue.
                                    data.id = jsPlumbUtil.uuid();
                                    callback(data);
                                }
                                else
                                // else advise the user.
                                    alert(type + " names must be at least 2 characters!");
                            }
                            // else...do not proceed.
                        }
                    });
                },
                beforeStartConnect:(node, edgeType) => {
                    // limit edges from start node to 1. if any other type of node, return
                    return (node.data.type === "start" && node.getEdges().length > 0) ? false : { label:"..." };
                }
            });

            this.view = {
                nodes: {
                    "start": {
                       jsx:(ctx) => { return <StartComponent ctx={ctx} /> }
                    },
                    "selectable": {
                        events: {
                            tap:  (params) => {
                                this.toolkit.toggleSelection(params.node);
                            }
                        }
                    },
                    "question": {
                        parent: "selectable",
                        jsx:(ctx) => { return <QuestionComponent ctx={ctx} /> }
                    },
                    "action": {
                        parent: "selectable",
                        jsx:(ctx) => { return <ActionComponent ctx={ctx} /> }
                    },
                    "output":{
                        parent:"selectable",
                        jsx:(ctx) => { return <OutputComponent ctx={ctx} /> }
                    }
                },
                // There are two edge types defined - 'yes' and 'no', sharing a common
                // parent.
                edges: {
                    "default": {
                        anchor:"AutoDefault",
                        endpoint:"Blank",
                        connector: ["EditableFlowchart", { cornerRadius: 5 } ],
                        paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
                        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
                        events: {
                            "dblclick":  (params) => {
                                Dialogs.show({
                                    id: "dlgConfirm",
                                    data: {
                                        msg: "Delete Edge"
                                    },
                                    onOK: () => {
                                        this.toolkit.removeEdge(params.edge);
                                    }
                                });
                            },
                            "click": (params) => {
                                this.surface.startEditing(params.edge);
                            }
                        },
                        overlays: [
                            [ "Arrow", { location: 1, width: 10, length: 10 }],
                            [ "Arrow", { location: 0.3, width: 10, length: 10 }]
                        ]
                    },
                    "connection":{
                        parent:"default",
                        overlays:[
                            [ "Label", {
                                label: "${label}",
                                events:{
                                    click:(params) => {
                                        this._editLabel(params.edge);
                                    }
                                }
                            }]
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
                    canvasClick: (e) => {
                        this.toolkit.clearSelection();
                        this.surface.stopEditing();
                    },
                    edgeAdded:(params) => {
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
                zoomToFit:true
            };
        }

        render() {
            return <div style={{width:"100%",height:"100%",display:"flex"}}>
                        <JsPlumbToolkitSurfaceComponent renderParams={this.renderParams} toolkit={this.toolkit} view={this.view} ref={ (c) => this.surface = c.surface }/>
                        <ControlsComponent ref={(c) => this.controls = c }/>
                        <div className="miniview"/>                        
                    </div>
        }

        dataGenerator (el) {
            return {
                w:120,
                h:120,
                type:el.getAttribute("data-node-type")
            };
        }

        componentDidMount() {
            this.toolkit.load({url:"data/copyright.json"});
            this.controls.initialize(this.surface);
            window.toolkit = this.toolkit;
            new jsPlumbToolkit.DrawingTools({
                renderer: this.surface
            });

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

        _editLabel (edge, deleteOnCancel) {
            Dialogs.show({
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
            });
        }
    }        

    ReactDOM.render(<DemoComponent/>, document.querySelector(".jtk-demo-canvas"));

});
