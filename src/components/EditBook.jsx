import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import { editBook } from '../actions';


class EditBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      title: props.title,
      author: props.author,
      series: props.series,
      edition: props.edition,
      publisher: props.publisher,
      year: props.year,
    };
    this.style = {
      padding: '2em'
    };
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <Paper style={this.style}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.props.dispatch(editBook(this.state));
            this.props.handlerCloseDialog();
          }}
        >
          <TextField
            autoFocus={true}
            floatingLabelText="Title"
            fullWidth={true}
            name="title"
            value={this.state.title}
            onChange={this.handleInputChange.bind(this)}
          />
          <TextField
            floatingLabelText="Author"
            fullWidth={true}
            name="author"
            value={this.state.author}
            onChange={this.handleInputChange.bind(this)}
          />
          <TextField
            floatingLabelText="Series"
            fullWidth={true}
            name="series"
            value={this.state.series}
            onChange={this.handleInputChange.bind(this)}
          />
          <TextField
            floatingLabelText="Edition"
            fullWidth={true}
            name="edition"
            value={this.state.edition}
            onChange={this.handleInputChange.bind(this)}
          />
          <TextField
            floatingLabelText="Publisher"
            fullWidth={true}
            name="publisher"
            value={this.state.publisher}
            onChange={this.handleInputChange.bind(this)}
          />
          <TextField
            floatingLabelText="Year"
            fullWidth={true}
            name="year"
            value={this.state.year}
            onChange={this.handleInputChange.bind(this)}
          />
          <RaisedButton
            type="submit"
            label="Edit Book"
            primary={true}
          />
        </form>
      </Paper>
    );
  }
};
EditBook = connect()(EditBook);

export default EditBook;
