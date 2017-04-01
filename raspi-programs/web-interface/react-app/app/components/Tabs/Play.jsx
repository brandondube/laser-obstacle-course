// react
import React from 'react';


const clockSty = {
  fontFamily: 'D7CMB',
};

const Play = (props) => {
  const {
    time,
  } = props;
  return (
    <div>
      <h1 style={clockSty}>
        {time}
      </h1>
    </div>
  );
};

export default Play;
