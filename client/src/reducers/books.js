import * as types from '../constants/ActionTypes';


const books = (state = [], action) => {
  switch (action.type) {
    case types.GET_BOOKS:
      return [
        ...action.books
      ];
    case types.EDIT_BOOK:
      return state.map(
        (book) => book.id === action.data.id ?
          {
            id: action.data.id,
            title: action.data.title,
            author: action.data.author,
            series: action.data.series,
            edition: action.data.edition,
            publisher: action.data.publisher,
            year: action.data.year
          } : book
      );
    default:
      return state;
  }
};

export default books;
