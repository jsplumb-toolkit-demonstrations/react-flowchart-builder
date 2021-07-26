import React from 'react';

export class ControlsComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div className="controls" ref={(c) => this._container = c}>
            <i className="fa fa-arrows selected-mode" data-mode="pan" title="Pan Mode" onClick={this.panMode.bind(this)}></i>
            <i className="fa fa-pencil" data-mode="select" title="Select Mode" onClick={this.selectMode.bind(this)}></i>
            <i className="fa fa-home" data-reset title="Zoom To Fit" onClick={this.reset.bind(this)}></i>
            <i className="fa fa-undo" undo="true" title="Undo last action" onClick={this.undo.bind(this)}></i>
            <i className="fa fa-repeat" redo="true" title="Redo last action" onClick={this.redo.bind(this)}></i>
            <i className="fa fa-times" title="Clear flowchart" onClick={this.clear.bind(this)}></i>
        </div>
    }

    initialize(surface) {
        this.surface = surface;
        this.toolkit = surface.toolkitInstance;
        this.undoManager = UndoRedo.createUndoRedoManager({
            surface:this.surface,
            compound:true,
            onChange:(mgr, undoCount, redoCount) => {
                this._container.setAttribute("can-undo", undoCount > 0);
                this._container.setAttribute("can-redo", redoCount > 0);
            }
        });

        this.surface.bind("mode", (mode) => {
            // jsPlumb.removeClass(this._container.querySelectorAll("[data-mode]"), "selected-mode");
            // jsPlumb.addClass(this._container.querySelectorAll("[data-mode='" + mode + "']"), "selected-mode");
        });
    }

    reset() {
        this.toolkit.clearSelection();
        this.surface.zoomToFit();
    }

    panMode() {
        this.surface.setMode("pan");
    }

    selectMode() {
        this.surface.setMode("select");
    }

    undo() {
        this.toolkit.undo();
    }

    redo() {
        this.toolkit.redo();
    }

    clear() {
        if (this.toolkit.getNodeCount() === 0 || confirm("Clear flowchart?")) {
            this.toolkit.clear();
        }
    }
}
