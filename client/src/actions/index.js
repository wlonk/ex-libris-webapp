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


function translateBookFromServer(book) {
  return {
    ...book,
    author: book.author ? book.author.name : null,
    series: book.series ? book.series.name : null,
    publisher: book.publisher ? book.publisher.name : null
  };
}

function translateBooksFromServer(books) {
  return books.map
    ? books.map(translateBookFromServer)
    : books;
}


export function editBook(data) {
  const book = {
    id: data.id,
    title: data.title || '',
    author: {
      name: data.author || ''
    },
    series: {
      name: data.series || ''
    },
    edition: data.edition || '',
    publisher: {
      name: data.publisher || ''
    },
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
    })
      .then((response) => response.json())
      .then(translateBookFromServer)
      .then((book) => dispatch({
        type: types.EDIT_BOOK,
        data: book
      }))
  };
}


export function getBooks() {
  return (dispatch) => {
    fetch(api.books(), {
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then(translateBooksFromServer)
      .then((books) => {
        return dispatch({
          type: types.GET_BOOKS,
          books
        });
      });
  };
}
