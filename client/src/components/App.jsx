import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { AuthGlobals } from "redux-auth/material-ui-theme";
import { OAuthSignInButton } from "redux-auth/material-ui-theme";
import { SignOutButton } from "redux-auth/material-ui-theme";

import { getBooks } from '../actions';
import BookList from './BookList';
import AddBook from '../containers/AddBook';


const style = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed'
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };
  }

  handleOpen() {
    this.setState({dialogOpen: true});
  }

  handleClose() {
    this.setState({dialogOpen: false});
  }

  render() {
    this.props.dispatch(getBooks());
    const isSignedIn = this.props.auth.getIn(["user", "isSignedIn"]);
    const addBook = isSignedIn ? (
      <FloatingActionButton
        style={style}
        onTouchTap={this.handleOpen.bind(this)}
      >
        <ContentAdd />
      </FloatingActionButton>
    ) : '';
    return (
      <div>
        <AuthGlobals />
        <AppBar
          title="Ex Libris"
          iconElementRight={isSignedIn ?
              <SignOutButton /> :
              <OAuthSignInButton provider="dropbox"/>}
        />
        <BookList />
        {addBook}
        <Dialog
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose.bind(this)}
        >
          <AddBook
            handlerCloseDialog={this.handleClose.bind(this)}
          />
        </Dialog>
      </div>
    );
  }
};
App = connect(({ auth }) => ({ auth }))(App);

export default App;
