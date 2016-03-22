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
});
