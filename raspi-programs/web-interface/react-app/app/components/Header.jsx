// react
import React from 'react';

// material-ui
// material-ui
// import RaisedButton from 'material-ui/RaisedButton';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';

import {
  indigo800 as bgBlue,
  yellow500 as yellow,
} from 'material-ui/styles/colors';

class Header extends React.Component {
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
