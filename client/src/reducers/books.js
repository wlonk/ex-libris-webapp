const books = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BOOK':
      return [
        ...state,
        {
          id: action.id,
          title: action.data.title,
          author: action.data.author,
          series: action.data.series,
          edition: action.data.edition,
          publisher: action.data.publisher,
          year: action.data.year
        }
      ];
    default:
      return state;
  }
};

export default books;
