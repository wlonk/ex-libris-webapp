const generatePaths = (model, id) => {
    if (id) {
      return `/api/${model}/${id}/`;
    } else {
      return `/api/${model}/`;
    }
}


const api = {
  books: (id) => {
    return generatePaths('books', id);
  },
  authors: (id) => {
    return generatePaths('authors', id);
  },
  publishers: (id) => {
    return generatePaths('publishers', id);
  },
  series: (id) => {
    return generatePaths('series', id);
  }
};
export default api;
