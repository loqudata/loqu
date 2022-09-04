import React from 'react';
// import ReactDOM from 'react-dom';

export default class BodyEnd extends React.Component {
    el: HTMLElement

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        // this.el.style.display = 'contents';
        this.el.id="portal";
        "position: fixed; left: 0; top: 0; z-index: 9999;".split("; ").map((rule) => {
            const [k, v] = rule.split(": ")
            this.el.style[k] = v
        })
        // The <div> is a necessary container for our
        // content, but it should not affect our layout.
        // Only works in some browsers, but generally
        // doesn't matter since this is at
        // the end anyway. Feel free to delete this line.
    }
    
    componentDidMount() {
        document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        document.body.removeChild(this.el);
    }
    
    render() {
        return null
        // return ReactDOM.createPortal(
        //     this.props.children,
        //     this.el,
        // );
    }
}
