import * as React from 'react'

import {SurfaceDropComponent} from '@jsplumbtoolkit/browser-ui-react'

class DragDropNodeSource extends SurfaceDropComponent {
    render() {
        return [
            <div data-node-type="question" title="Drag to add new" className="sidebar-item" data-width="240" data-height="220">
                <i className="icon-tablet"></i>Question
            </div>,
            <div data-node-type="action" title="Drag to add new" className="sidebar-item" data-width="240" data-height="160">
                <i className="icon-eye-open"></i>Action
            </div>,
            <div data-node-type="output" title="Drag to add new" className="sidebar-item" data-width="240" data-height="160">
                <i className="icon-eye-open"></i>Output
            </div>
        ];
    }
}

export default DragDropNodeSource
