import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import {
  Card,
  CardTitle,
  CardText,
  CardActions,
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';

import EditBook from './EditBook';


class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false
    };
    this.styles = {
      topLevel: {
        margin: '1em'
      },
      title: {
        fontStyle: 'italic'
      }
    };
  }

  handleOpen() {
    this.setState({dialogOpen: true});
  }

  handleClose() {
    this.setState({dialogOpen: false});
  }

  render() {
    const seriesNode = this.props.series ? (
      <TableRow>
        <TableRowColumn>Series:</TableRowColumn>
        <TableRowColumn>{this.props.series}</TableRowColumn>
      </TableRow>
    ) : '';
    const editionNode = this.props.edition ? (
      <TableRow>
        <TableRowColumn>Edition:</TableRowColumn>
        <TableRowColumn>{this.props.edition}</TableRowColumn>
      </TableRow>
    ) : '';
    const publisherNode = this.props.publisher ? (
      <TableRow>
        <TableRowColumn>Publisher:</TableRowColumn>
        <TableRowColumn>{this.props.publisher}</TableRowColumn>
      </TableRow>
    ) : '';
    const yearNode = this.props.year ? (
      <TableRow>
        <TableRowColumn>Year:</TableRowColumn>
        <TableRowColumn>{this.props.year}</TableRowColumn>
      </TableRow>
    ) : '';
    return (
      <Card
        style={this.styles.topLevel}
      >
        <CardTitle
          title={this.props.title}
          subtitle={this.props.author}
          style={this.styles.title}
        />
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
        <CardActions>
          <FlatButton
            label="Edit"
            onTouchTap={this.handleOpen.bind(this)}
          />
        </CardActions>
        <Dialog
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose.bind(this)}
        >
          <EditBook
            {...this.props}
            handlerCloseDialog={this.handleClose.bind(this)}
          />
        </Dialog>
      </Card>
    );
  }
};

Book.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  series: PropTypes.string,
  edition: PropTypes.string,
  publisher: PropTypes.string,
  year: PropTypes.string
};

export default Book;
