// react
import React from 'react';

// material-ui
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

const Play = (props) => {
  const {
    time,
  } = props;
  return (
    <div style={containerSty}>
      <div style={innerContainer}>
        <span style={clockSty}>
          {time}
        </span>
      </div>
    </div>
  );
};

export default Play;
