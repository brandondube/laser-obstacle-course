// react
import React from 'react';

// material-ui
import ActionHome from 'material-ui/svg-icons/action/home';
import HardwarePowerButton from 'material-ui/svg-icons/hardware/power-input';
import SettingsInputComponent from 'material-ui/svg-icons/action/settings-input-component';
import ImageTune from 'material-ui/svg-icons/Image/tune';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

import { Tabs, Tab } from 'material-ui/Tabs';

// components
import Rest from './Tabs/Rest';
import Align from './Tabs/Align';
import Calibrate from './Tabs/Calibrate';
import Play from './Tabs/Play';

class Body extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: 3,
      calibrationData: [],
    };
  };

  componentDidMount() {
    socket.on('cal:init', (numDiodes) => {
      this.setState({
        calibrationData: new Array(numDiodes),
      });
    });
    socket.on('cal:data', (diodeIndex, data) => {
      cd = [...this.state.calibrationData.slice(), data];
      this.setState({
        calibrationData: cd,
      });
    });
  }
  select = (index) => { this.setState({selectedTabIndex: index})};
  render() {
    return (
      <Tabs
        value={this.state.selectedTabIndex}
        onChange={this.select}
      >
        <Tab
          value={0}
          label="Rest"
          icon={<HardwarePowerButton/>}
        >
          <Rest />
        </Tab>
        <Tab
          value={1}
          label="Align"
          icon={<SettingsInputComponent/>}
        >
          <Align />
        </Tab>
        <Tab
          value={2}
          label="Calibrate"
          icon={<ImageTune/>}
        >
          <Calibrate data={this.state.calibrationData}/>
        </Tab>
        <Tab
          value={3}
          label="Play"
          icon={<AvPlayArrow/>}
        >
          <Play time="12:45" />
        </Tab>
      </Tabs>
    )
  };
};

export default Body;

