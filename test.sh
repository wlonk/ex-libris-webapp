#!/bin/bash

set -e

py.test --cov=ex_libris --cov-report=html --cov-report=term ex_libris $@
