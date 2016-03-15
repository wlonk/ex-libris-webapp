from ex_libris.books.utils import (
    extension_matches,
)


def test__extension_matches():
    assert extension_matches('pdf', 'foo.pdf')
    assert not extension_matches('txt', 'foo.pdf')
