import { fetch } from "redux-auth";

import * as types from '../constants/ActionTypes';
import api from '../api';


// from: https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function addBook(data) {
  const newBook = {
    title: data.title,
    author: data.author,
    series: data.series,
    edition: data.edition,
    publisher: data.publisher,
    year: data.year
  };

  return (dispatch) => {
    fetch(api.books(), {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      credentials: 'same-origin',
      body: JSON.stringify(newBook)
    }).then((response) => response.json()).then((json) => dispatch({
      type: types.ADD_BOOK,
      book: json
    }))
  };
}

export function editBook(data) {
  const book = {
    id: data.id,
    title: data.title,
    author: data.author,
    series: data.series,
    edition: data.edition,
    publisher: data.publisher,
    year: data.year
  };

  return (dispatch) => {
    fetch(api.books(data.id), {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      credentials: 'same-origin',
      body: JSON.stringify(book)
    }).then((response) => response.json()).then((json) => dispatch({
      type: types.EDIT_BOOK,
      book: json
    }))
  };
}


export function getBooks() {
  return (dispatch) => {
    fetch(api.books(), {
      credentials: 'same-origin'
    }).then(
      (response) => response.json()
    ).then((books) => {
      return dispatch({
        type: types.GET_BOOKS,
        books
      });
    });
  };
}
