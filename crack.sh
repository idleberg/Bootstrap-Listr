#!/bin/bash

VERSION=0.1
set -e

# Functions
function npm_error(){
    echo 'You need to install Node before we can continue (http://nodejs.org/)'
    exit 1
}

function bower_error(){
    while true; do
        read -p "Bower is not installed. Do you want to install it now? (y/n) " yn
        case $yn in
            [Yy*]* ) npm install bower || npm_error; break;;
            [Nn]* ) echo 'Aborted by user.'; exit;;
        esac
    done

    exit
}

# Let's go
echo $'\n'crack-listr $VERSION
echo ===============

if [ -e 'bower_components' ]
then
    echo 'Bower components seem to be in place'
else
    echo 'Bower components not found'
    echo 'Downloading components…'
    bower install || bower_error
fi

while true; do
        read -p "How about you, ready? (y/n) " yn
        case $yn in
            [Yy*]* ) break;;
            [Nn]* ) echo 'Aborted by user.'; exit;;
        esac
    done

echo $'Initializing…'
gulp init --silent

echo $'Running setup…'
gulp setup --silent
gulp theme --silent

echo $'Cracking…'
gulp make --silent

echo $'Completed.︎'