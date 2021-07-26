import { BaseNodeComponent, PropsWithContext }  from '@jsplumbtoolkit/browser-ui-react'
//import { Dialogs } from '@jsplumbtoolkit/dialogs'

/**
 * The superclass for node types that wish to support label edit and removal - Action, Output and Question nodes.
 */

export interface BaseComponentProps extends PropsWithContext {
    dlg:any
}

export class BaseEditableComponent<B extends BaseComponentProps, S> extends BaseNodeComponent<BaseComponentProps, S> {

    dialogManager:any

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
            // Dialogs.show({
            //     id: "dlgText",
            //     data: this.node.data,
            //     title: "Edit " + this.node.data.type + " name",
            //     onOK:  (data) => {
            //         if (data.text && data.text.length > 2) {
            //             // if name is at least 2 chars long, update the underlying data and
            //             // update the UI.
            //             this.toolkit.updateNode(this.node, data);
            //         }
            //     }
            // });
        }
    }
}
