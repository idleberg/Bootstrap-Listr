#!/bin/bash

VERSION=0.2.0
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
gulp init --silent      # clean up app-folder, copy files

echo $'Running setup…'
gulp bootstrap --silent # set Bootstrap/Bootswatch theme
gulp viewer --silent    # include Viewer dependencies
gulp search --silent    # include Search Box dependencies
gulp icons --silent     # include Font Awesome icons
gulp hljs --silent      # include Highlight.js
gulp apache --silent    # append H5BP's Apache Server Config
gulp robots --silent    # copy restrictive robots.txt

echo $'Cracking…'
gulp make --silent      # minify CSS & JS

echo $'Completed.︎'