#!/bin/bash

VERSION=0.2.4
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

if [ -e 'app' ]
then
	echo $'Cleaning up'
	gulp clean --silent
fi

# clean up app-folder, copy files
gulp init --silent

echo $'Initializing'

# clean up app-folder, copy files
gulp init --silent

echo $'Running setup'

# set Bootstrap/Bootswatch theme
gulp bootstrap --silent

# include Viewer dependencies
gulp viewer --silent

# include Search Box dependencies
gulp search --silent

# include Font Awesome icons
gulp icons --silent

# include Highlight.js
gulp hljs --silent
if [ -e 'app/assets/js/highlight.min.js' ]
then
	gulp hljs_theme --silent
fi

# append H5BP's Apache Server Config
gulp apache --silent

# copy restrictive robots.txt
gulp robots --silent

echo $'Minifying'

# minify CSS & JS
gulp make --silent

# merge all CSS and JS
gulp merge --silent
if [[ -e 'app/assets/css/listr.pack.css' || -e 'app/assets/js/listr.pack.js' ]]
then
	echo $'Merging'
	gulp post_merge --silent
fi

echo $'Completed!'