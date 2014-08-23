#!/bin/bash

VERSION=0.2.2

1=''
yellow='\033[33m'
default='\033[0m'

set -e

# Functions
function npm_error(){
    echo 'You need to install Node before we can continue (http://nodejs.org/)'
    exit 1
}

function completed(){
    echo $'\nCompleted.︎'
}

# Hello, my name is
echo $'\n'Listr-setup $VERSION
echo =================

if [ -z $1 ]
then
    if [[ -e './node_modules/bootstrap' && -e './node_modules/bootswatch' && -e './node_modules/font-awesome' && -e './node_modules/highlight.js' && -e './node_modules/jquery' ]]
    then
        echo "All Node modules seem to be in place"
    else
        echo 'Downloading missing Node modules…'
        npm install || npm_error
    fi

    # 
    if [[ -e './app/' ]]
    then
        while true; do
            read -p "Do you really want to overwrite your app folder? (y/n) " yn
            case $yn in
                [Yy]* )
                    rm -rf "./app";
                    break;;
                [Nn]* )
                    exit;;
            esac
        done
    fi
fi

# Create directories, copy files
if [[ $1 == 'init' || -z $1 ]]
then
    echo $'\nInitializing…'

    mkdir -p "./app/_public"
    cp -v "./src/public.htaccess" "./app/_public/.htaccess"
    cp -v "./src/root.htaccess" "./app/.htaccess"
    if [ -e './app/config.json' ]
    then
        cp -v "./src/config.json" "./app/config.json-example"
    else
        cp -v "./src/config.json" "./app/"
    fi
    cp -v "./src/index.php" "./app/"
    cp -v "./src/listr-functions.php" "./app/"
    cp -v "./src/listr-l10n.php" "./app/"
    cp -v "./src/listr-template.php" "./app/"

    mkdir -p "./app/assets/css"
    cp -v "./node_modules/bootstrap/dist/css/bootstrap.min.css" "./app/assets/css/"
    cp -v "./src/style.css" "./app/assets/css/listr.css"
    echo -e "${yellow}Action required:${default} Expecting a minified style-sheet (/assets/css/listr.min.css)";

    mkdir -p "./app/assets/fonts"
    cp -r -v "./node_modules/bootstrap/dist/fonts/" "./app/assets/fonts/"

    mkdir -p "./app/assets/js"
    cp -v "./src/scripts.js" "./app/assets/js/listr.js"
    echo -e "${yellow}Action required:${default} Expecting a minified library (/assets/js/listr.min.js)";

    if [[ $1 && $1 == 'theme' ]]
    then
        completed; exit;
    fi
fi

# Optional files
if [[ $1 == 'setup' || -z $1 ]]
then
    echo $'\nRunning setup…'

    while true; do
        read -p "Do you want to use the Viewer module? (y/n) " yn
        case $yn in
            [Yy]* )
                mkdir -p "./app/assets/js/";
                cp "./node_modules/jquery/dist/jquery.min.js" "./node_modules/bootstrap/dist/js/bootstrap.min.js" "./app/assets/js/";
                break;;
            [Nn]* )
                break;;
        esac
    done

    while true; do
        read -p "Do you want to use Font Awesome? (y/n) " yn
        case $yn in
            [Yy]* )
                mkdir -p "./app/assets/fonts/";
                cp -r "./node_modules/font-awesome/fonts/" "./app/assets/fonts/";
                break;;
            [Nn]* )
                break;;
        esac
    done

    while true; do
        read -p "Do you want to use Highlight.js? (y/n) " yn
        case $yn in
            [Yy]* )
                mkdir -p "./app/assets/js";
                cp "./node_modules/highlight.js/lib/highlight.js" "./app/assets/js/";
                echo -e "${yellow}Action required:${default} Expecting a minified library (/assets/js/highlight.min.js)";
                break;;
            [Nn]* )
                break;;
        esac
    done

    if [[ $1 && $1 == 'theme' ]]
    then
       completed; exit;
    fi
fi

# Set your Bootswatch theme
if [[ $1 == 'theme' || -z $1 ]]
then
    while true; do
        read -p $'\nEnter the name of your Bootswatch theme (or skip for default): ' theme

        case $theme in    
            'amelia'|'cerulean'|'cosmo'|'cyborg'|'darkly'|'flatly'|'journal'|'lumen'|'paper'|'readable'|'sandstone'|'simplex'|'slate'|'spacelab'|'superhero'|'united'|'yeti') 
                echo "Using $theme theme"
                cp "./node_modules/bootswatch/$theme/bootstrap.min.css" "./app/assets/css/"
            break;;
            * )
                echo "Using default theme"
                break;;
        esac
    done

    if [[ $1 && $1 == 'theme' ]]
    then
        completed; exit;
    fi
fi

completed