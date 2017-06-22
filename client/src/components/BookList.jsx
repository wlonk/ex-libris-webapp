import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Book from './Book';


class RawBookList extends React.Component {
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

RawBookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      series: PropTypes.string,
      edition: PropTypes.string,
      publisher: PropTypes.string,
      year: PropTypes.string
    }).isRequired
  ).isRequired
};


const BookList = connect(({ books }) => ({ books }))(RawBookList);

export default BookList;
