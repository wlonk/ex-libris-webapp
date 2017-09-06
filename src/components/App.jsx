import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { AuthGlobals } from "redux-auth/material-ui-theme";
import { OAuthSignInButton } from "redux-auth/material-ui-theme";
import { SignOutButton } from "redux-auth/material-ui-theme";

import { getBooks } from '../actions';
import BookList from './BookList';

import '../css/index.scss';


let App = ({ dispatch, auth }) => {
  dispatch(getBooks());
  const isSignedIn = auth.getIn(["user", "isSignedIn"]);
  const authButton = isSignedIn
    ? <SignOutButton />
    : <OAuthSignInButton provider="dropbox" />;
  return (
    <div>
      <AuthGlobals />
      <AppBar
        title="Ex Libris"
        iconElementRight={authButton}
        className="headerNav"
      />
      <BookList />
    </div>
  );
}
App = connect(({ auth }) => ({ auth }))(App);

export default App;
