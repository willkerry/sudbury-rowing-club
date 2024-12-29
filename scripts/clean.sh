#!/bin/bash

# Recursively remove all '.turbo' directories
find . -name '.turbo' -type d -exec rm -rf {} +

# Recursively remove all 'node_modules' directories
find . -name 'node_modules' -type d -exec rm -rf {} +

# Recursively remove all 'dist' directories
find . -name 'dist' -type d -exec rm -rf {} +

# Recursively remove all 'build' directories
find . -name 'build' -type d -exec rm -rf {} +

# Recursively remove all '.next' directories
find . -name '.next' -type d -exec rm -rf {} +
