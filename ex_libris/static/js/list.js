function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
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

$(document).ready(function() {
    $(".editable").editable({
        clear: false,
        emptytext: 'edit',
        mode: 'inline',
        onblur: 'submit',
        send: 'always',
        showbuttons: false
    });
    $(".has-editable").focus(function(e) {
        e.stopPropagation();
        $(e.target)
            .children('.editable')
            .editable('show');
    });
    $('tr').on('blur', '.form-control', function(e) {
        e.stopPropagation();
        $(e.target)
            .parents('span.editable-container')
            .siblings('.editable')
            .editable('hide');
    });
    // Shift-tab (reverse tabbing) will land on the enclosing .has-editable,
    // and force focus back to where it was again.

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
              '<div class="alert alert-danger">Something went wrong saving your changes. We\'ve been notified, and will fix it as soon as we can!</div>'
            );
        });
        e.preventDefault();
        return false;
    });
});
