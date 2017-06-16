let nextBookId = 0;
export const addBook = (data) => {
  return {
    type: 'ADD_BOOK',
    id: nextBookId++,
    data
  };
};

export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

export const toggleBook = (id) => {
  return {
    type: 'TOGGLE_BOOK',
    id
  };
};
