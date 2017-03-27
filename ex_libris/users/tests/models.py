import pytest


@pytest.fixture
def user(django_user_model):
    return django_user_model.objects.create(username='testuser')


@pytest.mark.django_db
def test__str__(user):
    assert str(user) == 'testuser'
