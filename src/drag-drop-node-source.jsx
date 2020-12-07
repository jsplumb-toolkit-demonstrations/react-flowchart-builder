import React from 'react';

import {SurfaceDropComponent} from 'jsplumbtoolkit-react-drop';

class DragDropNodeSource extends SurfaceDropComponent {
    render() {
        return [
            <div data-node-type="question" title="Drag to add new" className="sidebar-item">
                <i className="icon-tablet"></i>Question
            </div>,
            <div data-node-type="action" title="Drag to add new" className="sidebar-item">
                <i className="icon-eye-open"></i>Action
            </div>,
            <div data-node-type="output" title="Drag to add new" className="sidebar-item">
                <i className="icon-eye-open"></i>Output
            </div>
        ];
    }
}

export default DragDropNodeSource;
