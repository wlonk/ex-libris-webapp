import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { configure } from "redux-auth";
import thunk from 'redux-thunk';

import bookApp from './reducers';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';


injectTapEventPlugin();


const store = compose(
  applyMiddleware(thunk)
)(createStore)(bookApp);

store.dispatch(configure({
  // TODO:
  apiUrl: 'http://localhost',
  // signOutPath: '/evil_user_auth/sign_out',
  tokenValidationPath: '/users/validate_token/',
  authProviderPaths: {
    dropbox: '/accounts/custom_dropbox_oauth2/login/'
  }
}));

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
