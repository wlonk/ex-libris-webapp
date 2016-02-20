from fabric.api import (
    local,
    task,
)


@task(name='test', default=True)
def run_tests():
    local(
        'py.test '
        '--cov=ex_libris '
        '--cov-report=html '
        '--cov-report=term '
        'ex_libris'
    )
