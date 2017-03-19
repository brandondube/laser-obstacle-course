// react
import React from 'react';

// material-ui
import ActionHome from 'material-ui/svg-icons/action/home';
import HardwarePowerButton from 'material-ui/svg-icons/hardware/power-input';
import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';
import ImageTune from 'material-ui/svg-icons/Image/tune';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

import { Tabs, Tab } from 'material-ui/Tabs';

class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  select = (index) => { this.setState({selectedIndex: index})};
  render() {
    return (
        <Tabs selectedIndex={this.state.selectedIndex}>
          <Tab
            label="Rest"
            icon={<HardwarePowerButton/>}
            onTouchTap={() => this.select(0)}
          />
          <Tab
            label="Align"
            icon={<SettingsInputComponent/>}
            onTouchTap={() => this.select(1)}
          />
          <Tab
            label="Calibrate"
            icon={<ImageTune/>}
            onTouchTap={() => this.select(2)}
          />
          <Tab
            label="Play"
            icon={<AvPlayArrow/>}
            onTouchTap={() => this.select(3)}
          />
        </Tabs>
    )
  };
};

export default Body;

