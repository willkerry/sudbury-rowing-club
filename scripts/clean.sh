#!/bin/bash

# Recursively remove all '.turbo' directories
find . -name '.turbo' -type d -exec rm -rf {} +

# Recursively remove all 'node_modules' directories
find . -name 'node_modules' -type d -exec rm -rf {} +
