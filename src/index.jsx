import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { configure } from 'redux-auth';
import thunk from 'redux-thunk';
import './css/index.scss';

import bookApp from './reducers';
import App from './components/App';


injectTapEventPlugin();


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = composeEnhancers(applyMiddleware(thunk))(createStore)(bookApp);


// OAuth2 configuration:
store.dispatch(configure(
  {
    // TODO:
    apiUrl: '',
    // TODO: these should be nested under /api/:
    signOutPath: '/users/token/',
    tokenValidationPath: '/users/token/',
    authProviderPaths: {
      dropbox: '/accounts/custom_dropbox_oauth2/login/'
    }
  },
  { storage: 'localStorage', clientOnly: true }
));

render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
