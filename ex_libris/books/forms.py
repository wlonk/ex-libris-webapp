from django import forms

from .models import (
    Author,
    Publisher,
    Series,
    Book,
)


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


class BookForm(forms.ModelForm):
    author_name = forms.CharField(required=False)
    publisher_name = forms.CharField(required=False)
    series_name = forms.CharField(required=False)

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
            instance, _ = model.objects.get_or_create(
                name=self.cleaned_data[field + "_name"],
            )
            setattr(obj, field, instance)
        obj.save()
        return obj
