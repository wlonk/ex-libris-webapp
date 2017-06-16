import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import { addBook } from '../actions';


const extractValues = (obj) => {
  return Object.keys(obj).reduce((previous, current) => {
    previous[current] = obj[current].input.value;
    return previous;
  }, {});
}

const resetValues = (obj) => {
  for (let key in obj) {
    obj[key].input.value = '';
  }
};

let AddBook = ({ handlerCloseDialog, dispatch }) => {
  let data = {
    title: '',
    author: '',
    series: '',
    edition: '',
    publisher: '',
    year: ''
  };

  const style = {
    padding: '2em'
  };

  return (
    <Paper style={style}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (data.title.input && !data.title.input.value.trim()) {
            return;
          }
          dispatch(addBook(extractValues(data)));
          resetValues(data);
          handlerCloseDialog();
        }}
      >
        <TextField
          autoFocus={true}
          ref={(node) => { data.title = node }}
          floatingLabelText="Title"
          fullWidth={true}
        />
        <TextField
          ref={(node) => { data.author = node }}
          floatingLabelText="Author"
          fullWidth={true}
        />
        <TextField
          ref={(node) => { data.series = node }}
          floatingLabelText="Series"
          fullWidth={true}
        />
        <TextField
          ref={(node) => { data.edition = node }}
          floatingLabelText="Edition"
          fullWidth={true}
        />
        <TextField
          ref={(node) => { data.publisher = node }}
          floatingLabelText="Publisher"
          fullWidth={true}
        />
        <TextField
          ref={(node) => { data.year = node }}
          floatingLabelText="Year"
          fullWidth={true}
        />
        <RaisedButton
          type="submit"
          label="Add Book"
          primary={true}
        />
      </form>
    </Paper>
  );
};
AddBook = connect()(AddBook);

export default AddBook;
