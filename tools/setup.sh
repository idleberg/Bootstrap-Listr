#!/bin/bash

VERSION=0.4.1
set -e

# Functions
function npm_error(){
    echo 'You need to install Node before we can continue (http://nodejs.org/)'
    exit 1
}

# Let's go
echo $'\n'cracklistr $VERSION
echo ================

if [[ -e 'node_modules/apache-server-configs' && -e 'node_modules/bootstrap/dist' && -e 'node_modules/bootswatch' && -e 'node_modules/font-awesome' && -e 'node_modules/bower_components/hightlightjs' && -e 'node_modules/jquery' && -e 'node_modules/jquery-searcher' && -e 'node_modules/bower_components/m8tro-bootstrap' && -e 'node_modules/bower_components/stupid-jquery-table-sort' ]]
then
    echo "Node modules found"
else
    echo 'Missing Node modules, downloading'
    npm install || npm_error
fi

if [ -e 'app/config.json' ]
then
    # upgrade codebase only
    echo $'Updating codebase'
    gulp upgrade --silent
else
    # clean up app-folder, copy files
    echo $'Initializing application'
    gulp init --silent
fi

# set dependencies source
gulp setup --silent

# include Highlight.js
if [ -e 'app/assets/js/highlight.min.js' ]
then
	gulp hljs --silent
fi

echo $'Game over!'