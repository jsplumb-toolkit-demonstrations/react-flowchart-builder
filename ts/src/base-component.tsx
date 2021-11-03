import { BaseNodeComponent, PropsWithContext }  from '@jsplumbtoolkit/browser-ui-react'
import {DialogManager} from "./index"

/**
 * The superclass for node types that wish to support label edit and removal - Action, Output and Question nodes.
 */

export interface BaseComponentProps extends PropsWithContext {
    dlg:DialogManager
}

export class BaseEditableComponent<B extends BaseComponentProps, S> extends BaseNodeComponent<BaseComponentProps, S> {

    dialogManager:DialogManager

    constructor(props:B) {
        super(props)
        this.dialogManager = props.dlg
    }

    remove() {
        if (this.node) {
            this.dialogManager.confirmDelete(this.node.data, () => this.toolkit.removeNode(this.node))
        }
    }

    edit() {
        if (this.node) {
            this.dialogManager.editName(this.node.data, (data) => {
                if (data.text && data.text.length > 2) {
                    // if name is at least 2 chars long, update the underlying data and
                    // update the UI.
                    this.toolkit.updateNode(this.node, data);
                }
            })
        }
    }
}
