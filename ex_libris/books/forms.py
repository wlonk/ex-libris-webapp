from django import forms
from django.core.exceptions import ValidationError
from django.forms.fields import FileField

from taggit.forms import TagField

from .models import (
    Author,
    Publisher,
    Series,
    Book,
)


# From https://djangosnippets.org/snippets/2758/
class PatchModelForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        for fieldname in self.base_fields:
            self.base_fields[fieldname].required = False
        self.empty_permited = True
        return super().__init__(*args, **kwargs)

    def _clean_fields(self):
        for name, field in self.fields.items():
            # value_from_datadict() gets the data from the data dictionaries.
            # Each widget type knows how to retrieve its own data, because some
            # widgets split data over several HTML fields.
            value = field.widget.value_from_datadict(
                self.data,
                self.files,
                self.add_prefix(name)
            )
            # this is the key difference with the inherited behavior so fields
            # not present in the bound data do not get updated with None values
            if self.add_prefix(name) not in self.data:
                continue
            try:
                if isinstance(field, FileField):
                    initial = self.initial.get(name, field.initial)
                    value = field.clean(value, initial)
                else:
                    value = field.clean(value)
                self.cleaned_data[name] = value
                if hasattr(self, 'clean_{}'.format(name)):
                    value = getattr(self, 'clean_{}'.format(name))()
                    self.cleaned_data[name] = value
            except ValidationError as e:
                self._errors[name] = self.error_class(e.messages)
                if name in self.cleaned_data:
                    del self.cleaned_data[name]


class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = (
            'name',
        )


class PublisherForm(forms.ModelForm):
    class Meta:
        model = Publisher
        fields = (
            'name',
        )


class SeriesForm(forms.ModelForm):
    class Meta:
        model = Series
        fields = (
            'name',
        )


class BookForm(PatchModelForm):
    author_name = forms.CharField(required=False)
    publisher_name = forms.CharField(required=False)
    series_name = forms.CharField(required=False)
    tags = TagField(required=False)

    class Meta:
        model = Book
        fields = (
            'title',
            'edition',
            'year',
            'author_name',
            'publisher_name',
            'series_name',
            'tags',
        )

    def save(self, *args, **kwargs):
        obj = super().save(*args, **kwargs)
        model_field_pairs = (
            (Author, 'author'),
            (Publisher, 'publisher'),
            (Series, 'series'),
        )
        for model, field in model_field_pairs:
            name = self.cleaned_data.get(field + '_name')
            if name is not None:
                instance, _ = model.objects.get_or_create(
                    name=self.cleaned_data[field + "_name"],
                )
                setattr(obj, field, instance)
        obj.save()
        return obj
