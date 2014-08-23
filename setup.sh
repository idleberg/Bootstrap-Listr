#!/bin/bash

VERSION=0.1.2
set -e

# Functions
function npm_error(){
    echo 'You need to install Node before we can continue (http://nodejs.org/)'
    exit 1
}

# Let's go
echo $'\n'Listr-setup $VERSION
echo =================

if [ -e 'node_modules' ]
then
    echo "Node modules seem to be in place"
else
    echo 'Node modules not found'
    echo 'Downloading…'
    npm install || npm_error
fi

echo $'Initializing…'
gulp init --silent

echo $'Running setup…'
gulp setup --silent
gulp theme --silent

echo $'Cracking…'
gulp make --silent

echo $'Completed.︎'