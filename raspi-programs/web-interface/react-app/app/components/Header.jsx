// react
import React from 'react';

// material-ui
// import RaisedButton from 'material-ui/RaisedButton';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import Slider from 'material-ui/Slider';

import {
  indigo800 as bgBlue,
  yellow500 as yellow,
} from 'material-ui/styles/colors';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 75,
    };
  }

  changeVolume = (e, v) => {
    this.setState({volume: v});
    socket.emit('set-volume', v);
  }

  render() {
    return (
      <Toolbar style={{ background: bgBlue }}>
        <ToolbarGroup>
          <ToolbarTitle
            style={{ color: yellow }}
            text="MILaser"
          />
          <ToolbarSeparator />
          <ToolbarTitle
            style={{ color: yellow }}
            text="&nbsp; &nbsp; UR OSA Student Chapter"
          />
        </ToolbarGroup>
        <ToolbarGroup>
            <Slider
              min={0}
              max={100}
              step={1}
              defaultValue={75}
              value={this.state.volume}
              onChange={this.changeVolume}
              style={{
                width: '300px',
                marginTop: '22px',
                marginRight: '25px',
              }}
            />
            <ToolbarTitle
              style={{ color: yellow }}
              text="Now Playing: Mission Impossible - Main Theme"
            />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default Header
