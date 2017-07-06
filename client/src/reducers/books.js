import * as types from '../constants/ActionTypes';


const books = (state = [], action) => {
  switch (action.type) {
    case types.ADD_BOOK:
      return [
        {
          id: action.id,
          title: action.data.title,
          author: action.data.author,
          series: action.data.series,
          edition: action.data.edition,
          publisher: action.data.publisher,
          year: action.data.year
        },
        ...state
      ];
    case types.GET_BOOKS:
      return [
        ...state,
        ...action.books
      ];
    case types.EDIT_BOOK:
      return state.map(
        (book) => book.id === action.id ?
          {
            id: action.id,
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
