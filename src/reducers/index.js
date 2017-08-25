import { combineReducers } from 'redux';
import { authStateReducer as auth } from "redux-auth";

import books from './books';

const bookApp = combineReducers({
  books,
  auth
});

export default bookApp;
