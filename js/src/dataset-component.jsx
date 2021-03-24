import React from 'react';
import ReactDOM from "react-dom";

import * as SyntaxHighlighter from "@jsplumb/json-syntax-highlighter"

export class DatasetComponent extends React.Component {


    constructor(props) {
        super(props)
    }

    render() {
        return <div className="jtk-demo-dataset"></div>
    }

    initialize(surface) {
        SyntaxHighlighter.newInstance(surface.toolkitInstance, ReactDOM.findDOMNode(this))
    }

    componentDidMount() {
        if (this.props.surface != null) {
            this.initialize(this.props.surface);
        }
    }
}
