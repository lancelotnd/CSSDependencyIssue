#!/bin/bash

# Loop through each package in dependencies and devDependencies
for package in $(jq -r '.dependencies, .devDependencies | keys[]' package.json)
do
    echo "Checking $package"
    yarn why $package
    echo
    echo
    echo
done
