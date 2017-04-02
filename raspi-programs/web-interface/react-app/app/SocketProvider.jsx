// react
import React from 'react';

class SocketProvider extends React.Component {
  getChildContext() {
    return { socket: this.props.socket };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const T = React.PropTypes;
SocketProvider.childContextTypes = {
  socket: T.object,
};
SocketProvider.propTypes = {
  socket: T.object,
  children: T.array,
};

export default SocketProvider;
