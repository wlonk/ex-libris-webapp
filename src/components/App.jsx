import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { AuthGlobals } from "redux-auth/material-ui-theme";
import { OAuthSignInButton } from "redux-auth/material-ui-theme";
import { SignOutButton } from "redux-auth/material-ui-theme";

import { getBooks } from '../actions';
import BookList from './BookList';

const styles = {
  headerNav: {
    color: '#f4f2ef',
    backgroundColor: '#3d3a35'
  },
  headerButton: {
    marginTop: '5px',
    backgroundColor: '#f4f2ef'
  }
};


let App = ({ dispatch, auth }) => {
  dispatch(getBooks());
  const isSignedIn = auth.getIn(["user", "isSignedIn"]);
  const authButton = isSignedIn
    ? <SignOutButton style={styles.headerButton} />
    : <OAuthSignInButton provider="dropbox" style={styles.headerButton} />;
  return (
    <div>
      <AuthGlobals />
      <AppBar
        title="Ex Libris"
        iconElementRight={authButton}
        style={styles.headerNav}
      />
      <BookList />
    </div>
  );
}
App = connect(({ auth }) => ({ auth }))(App);

export default App;
