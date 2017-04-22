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


// utility functions
import timeOffsetToString from '../lib/timeOffsetToString';

const inkBarHeight = {
  height: 6,
};

const indextoGameMode = {
  0: 'rest',
  1: 'align',
  2: 'calibrate',
  3: 'game'
};

class Body extends React.Component {
  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      selectedTabIndex: 3,
      calibrationData: [],
      timeReference: now,
      timeCurrent: now,
    };
  };

  componentDidMount() {
    const socket = this.context.socket;
    // bind calibration event behavior
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
    // bind game event behavior
    socket.on('game:start', () => {
      this.timer = setInterval(
        this.tick,
        1000
      );
    });
    socket.on('game:end', () => {
      clearInterval(this.timer);
    });

    socket.emit('setmode:game');
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => {this.setState({ timeCurrent: new Date()}) };
  select = (index) => {
    const socket = this.context.socket;
    socket.emit(`setmode:${indextoGameMode.index}`);
    this.setState({selectedTabIndex: index})
  };
  render() {
    return (
      <Tabs
        value={this.state.selectedTabIndex}
        onChange={this.select}
        inkBarStyle={inkBarHeight}
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
          <Play
            time={timeOffsetToString(this.state.timeCurrent - this.state.timeReference)}
          />
        </Tab>
      </Tabs>
    )
  };
};

const T = React.PropTypes;
Body.contextTypes = {
  socket: T.object,
};

export default Body;
