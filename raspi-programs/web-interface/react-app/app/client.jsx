// hot reloading
import { AppContainer } from 'react-hot-loader';

// react
import React from 'react';
import ReactDOM from 'react-dom';

// stupid react-hot-loader injection
import AppRoot from './AppRoot';

// stupid tap-touch (MUI dependency)
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('react-root'),
  );
};

render(AppRoot);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./AppRoot.jsx', () => {
    const NewApp = require('./AppRoot.jsx').default;
    render(NewApp);
  });
}
