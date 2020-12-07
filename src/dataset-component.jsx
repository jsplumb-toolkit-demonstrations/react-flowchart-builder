import React from 'react';
import ReactDOM from "react-dom";

export class DatasetComponent extends React.Component {

    _syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return "<pre>" + json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,  (match) => {
            let cls = 'number';
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = 'key';
              } else {
                cls = 'string';
              }
            } else if (/true|false/.test(match)) {
              cls = 'boolean';
            } else if (/null/.test(match)) {
              cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
          }) + "</pre>";
      }

    constructor(props) {
        super(props)
    }

    render() {
        return <div className="jtk-demo-dataset"></div>
    }

    updateDataset() {
        let json = this._syntaxHighlight(JSON.stringify(this.toolkit.exportData(), null, 2));
        ReactDOM.findDOMNode(this).innerHTML = json;
      }

    initialize(surface) {
        this.toolkit = surface.getToolkit();
        this.toolkit.bind("dataUpdated", () => {
            this.updateDataset();
        });
        this.updateDataset();
    }

    componentDidMount() {
        if (this.props.surface != null) {
            this.initialize(this.props.surface);
        }
    }
}
