// react
import React from 'react';

// material-ui
import RaisedButton from 'material-ui/RaisedButton';
import * as Colors from 'material-ui/styles/colors';

const containerSty = {
  textAlign: 'center',
  background: Colors.indigo800,
};

const innerContainer = {
  display: 'inline-block',
  verticalAlign: 'middle',
  margin: '0 auto',
};

const clockSty = {
  fontSize: 72,
  fontFamily: 'D7CMB',
  color: Colors.yellow500,
};

class Play extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentButton: 'play',
    };
  }

  handlePlayClick = () => {
    const socket = this.context.socket;
    socket.emit('game:start');
    this.setState({
      currentButton: 'stop',
    });
  }
  handleStopClick = () => {
    const socket = this.context.socket;
    socket.emit('game:forcestop');
    this.setState({
      currentButton: 'play',
    });
  }
  render() {
    const { time } = this.props;
    let button;
    if (this.state.currentButton === 'play') {
      button = <RaisedButton
            label="Play"
            labelStyle={{
              fontSize: 48,
              padding: 48,
            }}
            onTouchTap={this.handlePlayClick}
          />;
      }
    else {
      button = <RaisedButton
            label="Stop"
            labelStyle={{
              fontSize: 48,
              padding: 48,
            }}
            onTouchTap={this.handleStopClick}
          />
    }
    return (
      <div style={containerSty}>
        <div style={innerContainer}>
          {button}
          <br />
          <span style={clockSty}>
            {time}
          </span>
        </div>
      </div>
    );
  }
};

const T = React.PropTypes;
Play.contextTypes = {
  socket: T.object,
}
export default Play;
