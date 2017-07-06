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


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = composeEnhancers(applyMiddleware(thunk))(createStore)(bookApp);


// OAuth2 configuration:
store.dispatch(configure({
  // TODO:
  apiUrl: '',
  // signOutPath: '/evil_user_auth/sign_out',
  // TODO: this should be nested under /api/:
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
