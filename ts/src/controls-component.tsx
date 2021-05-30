import * as React from 'react'

import { Surface, BrowserUI} from "@jsplumbtoolkit/browser-ui"
import * as UndoRedo from "@jsplumbtoolkit/undo-redo"
import {UndoRedoManager} from "@jsplumbtoolkit/undo-redo"

export class ControlsComponent extends React.Component<any, any> {

    surface:Surface
    toolkit:BrowserUI
    _container:HTMLElement
    undoManager:UndoRedoManager

    constructor(props:any) {
        super(props)
    }

    render() {
        return <div className="controls" ref={(c) => this._container = c}>
            <i className="fa fa-arrows selected-mode" data-mode="pan" title="Pan Mode" onClick={this.panMode.bind(this)}></i>
            <i className="fa fa-pencil" data-mode="select" title="Select Mode" onClick={this.selectMode.bind(this)}></i>
            <i className="fa fa-home" data-reset title="Zoom To Fit" onClick={this.reset.bind(this)}></i>
            <i className="fa fa-undo" data-undo="true" title="Undo last action" onClick={this.undo.bind(this)}></i>
            <i className="fa fa-repeat" data-redo="true" title="Redo last action" onClick={this.redo.bind(this)}></i>
            <i className="fa fa-times" title="Clear flowchart" onClick={this.clear.bind(this)}></i>
        </div>
    }

    initialize(surface:Surface) {
        this.surface = surface
        this.toolkit = surface.toolkitInstance
        this.undoManager = UndoRedo.newInstance({
            surface:this.surface,
            compound:true,
            onChange:(mgr:any, undoCount:number, redoCount:number) => {
                this._container.setAttribute("can-undo", undoCount > 0 ? "true" : "false")
                this._container.setAttribute("can-redo", redoCount > 0 ? "true" : "false")
            }
        });

        this.surface.bind("mode", (mode) => {
            // this.surface.removeClass(this._container.querySelectorAll("[data-mode]"), "selected-mode");
            // this.surface.addClass(this._container.querySelectorAll("[data-mode='" + mode + "']"), "selected-mode");
        });
    }

    reset() {
        this.toolkit.clearSelection()
        this.surface.zoomToFit()
    }

    panMode() {
        this.surface.setMode("pan")
    }

    selectMode() {
        this.surface.setMode("select")
    }

    undo() {
        this.undoManager.undo()
    }

    redo() {
        this.undoManager.redo()
    }

    clear() {
        if (this.toolkit.getNodeCount() === 0 || confirm("Clear flowchart?")) {
            this.toolkit.clear()
        }
    }
}
