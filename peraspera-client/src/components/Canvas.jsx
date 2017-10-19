import React from 'react';
import ReactDOM from 'react-dom';

/**
* Renders a canvas element and calls an onMount handler
*/
export default class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {
        display: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: this.props.height,
        width: '100%',
        height: '100%'
      }
    }

    this.setSize = this.setSize.bind(this);
  }

  setSize() {
    const rect = ReactDOM.findDOMNode(this.refs.canvas.parentNode).getBoundingClientRect()
    this.refs.canvas.width = rect.width;
    this.refs.canvas.height = rect.height;
    // this.setState({style: { height: rect.height, width: rect.width }})
  }

  /**
  * Setup is complete, get the canvas context and call
  * the onMount handler
  */
  componentDidMount() {
    // window.addEventListener('resize', this.resize);
    this.setSize();
    const ctx = this.refs.canvas.getContext('2d');
    if ('function' === typeof this.props.onMount) {
      this.props.onMount(ctx);
    }
  }

  /**
  * Teardown about to be performed, call willUnmount
  * so any external cleanup can be done
  */
  componentWillUnmount() {
    // window.removeEventListener('resize', this.resize);
    if ('function' === typeof this.props.willUnmount) {
      this.props.willUnmount();
    }
  }

  render() {
    return (
      <div style={this.state.style}>
        <canvas ref="canvas" />
      </div>
    );
  }
}
