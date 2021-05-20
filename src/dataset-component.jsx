import React from 'react';
import ReactDOM from "react-dom";
import * as SyntaxHighlighter from "@jsplumb/json-syntax-highlighter";

/**
 * A simple component that dumps the current dataset as json.
 */
export class DatasetComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div className="jtk-demo-dataset"></div>
    }

    initialize(surface) {
        this.toolkit = surface.getToolkit();
        this.syntaxHighlighter = SyntaxHighlighter.newInstance(this.toolkit, ReactDOM.findDOMNode(this), 2)
    }

    componentDidMount() {
        if (this.props.surface != null) {
            this.initialize(this.props.surface);
        }
    }
}
