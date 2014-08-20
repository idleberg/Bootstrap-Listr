#!/bin/bash

VERSION=0.2

yellow='\033[33m'
default='\033[0m'

set -e

# Functions
function npm_error(){
    echo 'You need to install Node before we can continue (http://nodejs.org/)'
    exit 1
}

# Hello, my name is
echo $'\n'crack-listr $VERSION
echo ===============

# Check Node modules
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
                echo "Aborted by user."
                exit;;
        esac
    done
fi

# Create directories, copy files
echo $'\nInitializing…'

mkdir -p "./app/_public"
cp -v "./src/public.htaccess" "./app/_public/.htaccess"
cp -v "./src/root.htaccess" "./app/.htaccess"
cp -v "./src/config.json" "./app/"
cp -v "./src/index.php" "./app/"
cp -v "./src/listr-functions.php" "./app/"
cp -v "./src/listr-l10n.php" "./app/"
cp -v "./src/listr-template.php" "./app/"

mkdir -p "./app/assets/css"
cp -v "./node_modules/bootstrap/dist/css/bootstrap.min.css" "./app/assets/css/"

mkdir -p "./app/assets/fonts"
cp -r -v "./node_modules/bootstrap/dist/fonts/" "./app/assets/fonts/"

# Optional files
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
            echo -e "${yellow}Action required:${default} Bootstrap Listr expects a minified library (highlight.min.js)";
            break;;
        [Nn]* )
            break;;
    esac
done

# Set your Bootswatch theme
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

echo $'\nCompleted.︎'