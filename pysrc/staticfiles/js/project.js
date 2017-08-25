function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});

window.currentFocusField = -1;

function focusCurrent(amount) {
  var max = $(".has-editable").length;
  window.currentFocusField += amount;
  if (window.currentFocusField < 0) {
    window.currentFocusField = 0;
  }
  if (window.currentFocusField >= max) {
    window.currentFocusField = max - 1;
  }
  $(`.has-editable:eq(${window.currentFocusField})`).focus();
}


function setInPlaceEditing(selector, source) {
  var options = {
    clear: false,
    emptytext: 'edit',
    mode: 'inline',
    onblur: 'submit',
    send: 'always',
    showbuttons: false
  };
  if (source !== undefined) {
    options['typeahead'] = [
      {
        minLength: 1,
        hint: false,
        highlight: true
      },
      {
        display: 'name',
        source: source
      }
    ];
  }
  $(selector).editable(options);
}


function setMassEditing(selector, source) {
  $(selector).typeahead({
    minLength: 1,
    hint: false,
    highlight: true
  },
  {
    display: 'name',
    source: source
  });
}


$(document).ready(function() {
  var authors = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: '/books/api/authors/'
  });
  var publishers = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: '/books/api/publishers/'
  });
  var series = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: '/books/api/series/'
  });
  setInPlaceEditing(".editable.plain");

  setInPlaceEditing(".editable.typeahead.author", authors.ttAdapter());
  setInPlaceEditing(".editable.typeahead.publisher", publishers.ttAdapter());
  setInPlaceEditing(".editable.typeahead.series", series.ttAdapter());

  setMassEditing('#id_author_name', authors);
  setMassEditing('#id_publisher_name', publishers);
  setMassEditing('#id_series_name', series);

  $(".has-editable").focus(function(e) {
    e.stopPropagation();
    window.currentFocusField = $(this).data('mockTabIndex');
    $(e.target)
      .children('.editable')
      .editable('show');
  }).each(function(i) {
    $(this).data('mockTabIndex', i);
  });

  $(window).keydown(function(evt) {
    var TAB = 9;
    if (evt.keyCode == TAB) {
      if (evt.shiftKey) {
        focusCurrent(-1);
      } else {
        focusCurrent(+1);
      }
      evt.preventDefault();
    }
  });

  // Highlight checked rows
  $('.book-row-checkbox').change(function () {
    if (this.checked) {
      $(this).parents('tbody').addClass('selected');
    } else {
      $(this).parents('tbody').removeClass('selected');
    }
  });

  // When we submit the edit form, we need to know which book IDs to edit.
  $('#edit_form').submit(function(e) {
    var data = $(this).serialize();
    var ajaxes = $('.book-row-checkbox:checked').map(function() {
      var bookId = $(this).parents('tbody').data('book_id');
      return $.ajax(`/books/${bookId}/`, {
        method: 'POST',
        data: data
      });
    }).get();
    $.when.apply($, ajaxes).done(function(results) {
      $('#edit-modal').modal('hide');
      // Refresh page to re-render with latest data. This is a reason to
      // consider a single-page app.
      document.location.reload(true);
    }).fail(function(error) {
      $('#edit-modal').modal('hide');
      $('#body-container').prepend(
          '<div class="alert alert-danger">Something went wrong saving your ' +
          'changes. We\'ve been notified, and will fix it as soon as we ' +
          'can!</div>'
          );
    });
    e.preventDefault();
    return false;
  });
});
