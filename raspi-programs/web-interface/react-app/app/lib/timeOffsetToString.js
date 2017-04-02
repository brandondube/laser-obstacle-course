const zeroPad = (num, places) => `${Array(places).fill(0).join('')}${num}`;

const timeOffsetToString = (delta) => {
  // compute numbers of hours, minutes, seconds
  var hours   = Math.floor(delta / 3.6e6);                 // 60 * 60 * 1000
  var minutes = Math.floor((delta % 3.6e6) / 6e4);         // 60 * 1000
  var seconds = Math.floor(((delta % 3.6e6) % 6e4) / 1e3); // 1000
  var ms      = Math.floor(((delta % 3.6e6) % 6e4) % 1e3);

  var msStrLen = ms.toString().length;
  var secStrLen = seconds.toString().length;
  var minStrLen = minutes.toString().length;
  if (msStrLen < 3) {
    ms = zeroPad(ms, 3 - msStrLen);
  }
  if (secStrLen < 2) {
    seconds = zeroPad(seconds, 2 - secStrLen);
  }
  if (minStrLen < 2) {
    minutes = zeroPad(minutes, 2 - minStrLen);
  }

  return `${hours}:${minutes}:${seconds}:${ms}`;
};

export default timeOffsetToString;
