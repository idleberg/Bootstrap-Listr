#!/bin/bash

VERSION=0.3.4
set -e

# Functions
function npm_error(){
    echo 'You need to install Node before we can continue (http://nodejs.org/)'
    exit 1
}

# Let's go
echo $'\n'cracklistr $VERSION
echo ================

if [[ -e 'node_modules/apache-server-configs' && -e 'node_modules/bootstrap/dist' && -e 'node_modules/bootswatch' && -e 'node_modules/font-awesome' && -e 'node_modules/jquery' && -e 'node_modules/jquery-searcher' ]]
then
    echo "    Node modules found"
else
    echo '    Missing Node modules, downloading'
    npm install || npm_error
fi

if [ -e 'app/config.json' ]
then
    # upgrade codebase only
    echo $'    Updating codebase'
    gulp upgrade --silent
else
    # clean up app-folder, copy files
    echo $'    Initializing application'
    gulp init --silent
fi

# clean up app-folder, copy files
gulp init --silent

echo $'    Running setup'

# set dependencies source
gulp dependencies --silent

# set Bootstrap/Bootswatch theme
gulp bootstrap --silent

# include Stupid Table dependencies
gulp sort --silent

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

echo $'    Cracking...'

# minify CSS & JS
gulp make --silent

# merge all CSS and JS
gulp merge --silent
if [[ -e 'app/assets/css/listr.pack.css' || -e 'app/assets/js/listr.pack.js' ]]
then
	echo $'    Crunching...'
	gulp post_merge --silent
fi

echo $'    Game over!'