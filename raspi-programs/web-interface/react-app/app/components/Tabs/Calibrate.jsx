// react
import React from 'react';

// material-ui
import TextField from 'material-ui/TextField';

const containerSty = {
  padding: 20,
};
const inputSty = {
  width: 60,
};

export default class Calibrate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numSamples: 200,
    };
  }

  numSamplesChange = (e, v) => {
    this.setState({
      numSamples: v
    });
  }

  render() {
    const datastr = JSON.stringify(this.props.data, null, 2);
    return (
      <div style={containerSty}>
        <h2> This sets the expected value for the photoresistors. </h2>
        <span> Enter a number of samples to take: </span> &nbsp;
        <TextField
          id="sampleCountSelector"
          value={this.state.numSamples}
          onChange={this.numSamplesChange}
          hintText="Each sample takes ~5ms to collect"
          type="number"
          style={inputSty}
        />
        <h3> Gathered data: </h3>
        <pre>
          {datastr}
        </pre>
      </div>
    );
  };
}
