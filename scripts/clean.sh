#!/bin/bash

# Recursively remove all '.turbo' directories
find . -name '.turbo' -type d -exec rm -rf {} +
