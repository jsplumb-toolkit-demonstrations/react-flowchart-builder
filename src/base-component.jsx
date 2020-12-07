import { BaseNodeComponent }  from 'jsplumbtoolkit-react';
import { Dialogs } from 'jsplumbtoolkit';

/**
 * The superclass for node types that wish to support label edit and removal - Action, Output and Question nodes.
 */
export class BaseEditableComponent extends BaseNodeComponent {

    constructor(props) {
        super(props);
    }

    remove() {
        if (this.node) {
            Dialogs.show({
                id: "dlgConfirm",
                data: {
                    msg: "Delete '" + this.node.data.text + "'"
                },
                onOK: () => {
                    this.toolkit.removeNode(this.node);
                }
            });
        }
    }

    edit() {
        if (this.node) {
            Dialogs.show({
                id: "dlgText",
                data: this.node.data,
                title: "Edit " + this.node.data.type + " name",
                onOK:  (data) => {
                    if (data.text && data.text.length > 2) {
                        // if name is at least 2 chars long, update the underlying data and
                        // update the UI.
                        this.toolkit.updateNode(this.node, data);
                    }
                }
            });
        }
    }
}
