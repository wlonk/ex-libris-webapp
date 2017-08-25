import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Book from './Book';


class BookList extends React.Component {
  render() {
    return (
      <div>
        {this.props.books.map((book) => (
          <Book key={book.id} {...book} />
        ))}
      </div>
    );
  }
};

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      edition: PropTypes.string,
      year: PropTypes.number,
      author: PropTypes.string,
      series: PropTypes.string,
      publisher: PropTypes.string
    }).isRequired
  ).isRequired
};


BookList = connect(({ books }) => ({ books }))(BookList);

export default BookList;
