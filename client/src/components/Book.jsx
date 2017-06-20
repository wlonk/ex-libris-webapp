import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


const style = {
  'margin': '1em'
};

const Book = ({ title, author, series, edition, publisher, year }) => {
  const seriesNode = series ? (
    <TableRow>
      <TableRowColumn>Series:</TableRowColumn>
      <TableRowColumn>{series}</TableRowColumn>
    </TableRow>
  ) : '';
  const editionNode = edition ? (
    <TableRow>
      <TableRowColumn>Edition:</TableRowColumn>
      <TableRowColumn>{edition}</TableRowColumn>
    </TableRow>
  ) : '';
  const publisherNode = publisher ? (
    <TableRow>
      <TableRowColumn>Publisher:</TableRowColumn>
      <TableRowColumn>{publisher}</TableRowColumn>
    </TableRow>
  ) : '';
  const yearNode = year ? (
    <TableRow>
      <TableRowColumn>Year:</TableRowColumn>
      <TableRowColumn>{year}</TableRowColumn>
    </TableRow>
  ) : '';
  const titleStyle = {
    'font-style': 'italic'
  };
  return (
    <Card style={style}>
      <CardTitle title={title} subtitle={author} style={titleStyle} />
      <CardText>
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            {seriesNode}
            {editionNode}
            {publisherNode}
            {yearNode}
          </TableBody>
        </Table>
      </CardText>
    </Card>
  );
};

Book.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  series: PropTypes.string,
  edition: PropTypes.string,
  publisher: PropTypes.string,
  year: PropTypes.string
};

export default Book;
