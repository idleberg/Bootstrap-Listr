it# Bootstrap Listr [![Build Status](https://travis-ci.org/idleberg/Bootstrap-Listr.svg)](https://travis-ci.org/idleberg/Bootstrap-Listr) [![Dependencies](https://david-dm.org/idleberg/Bootstrap-Listr.svg)](https://david-dm.org/idleberg/Bootstrap-Listr)

A replacement for default server indexes, Bootstrap Listr beautifully displays folders and files in the browser. It is built upon the [Bootstrap](http://getbootstrap.com) framework and optionally makes use of [Bootswatch](http://bootswatch.com/) themes and [Font Awesome](http://fortawesome.github.io/Font-Awesome/) icons.

*Watch a [live demo](http://demo.idleberg.com/Bootstrap-Listr-2.0-dev/)!*

## Installation

1. Clone the repository `git clone https://github.com/idleberg/Bootstrap-Listr.git` 
2. Change directory `cd Bootstrap-Listr`
3. Install all Node dependencies `npm install`

## Building

If you're already overwhelmed by the idea of having to build stuff, or simply wonder what happened to the old one-file solution—get the old version [here](https://github.com/idleberg/Bootstrap-Listr/tree/1.0-dev/)!

### Local

[Gulp](http://gulpjs.com/) tasks are used to configure and build your app. You can install Gulp globally using `npm install gulp -g`. For your convenience, `setup.sh` is provided to run all setup tasks. Alternatively, you can run Gulp tasks manually:

    # create and populate app-folder
    gulp init

    # choose default theme (optional)
    gulp bootstrap

    # enable the Viewer modal (optional)
    gulp viewer

    # enable the Search Box (optional)
    gulp search

    # enable Font Awesome icons (optional)
    gulp icons

    # enable syntax highlighting (optional)
    gulp highlighter

    # minify CSS, uglify JS
    gulp make

For a full list of available commands, type `gulp help`.

### CDN

Instead of running your dependencies locally, you can make use of various content delivery networks (CDN). Initialize your app using `gulp init` and set "dependencies" to "cdn" in your `config.json`. You can then specify your preferred CDNs (and all other preferences) in this file as well (see [below](#options) for details!)

## Deployment

Copy `app/` to your server, then rename `config.json-example` to `config.json` and edit your settings. All files that should be accessible in the browser go into the `_public` folder (you can change the folder in the config). Depending on your Apache settings, you might have to uncomment the `RewriteBase` setting in the `.htaccess` file (maybe add parent folder name after the slash.)

## Options

You can configure a number of settings in the file `config.json`:

* Optional columns for size, modified date, permissions
* Document icons
* File viewer for images, videos, audio and source code
* Search box to filter results
* Column sorting
* Responsive tables
* List of ignored files
* Default location for JavaScript libraries and style sheets
* Syntax highlighting in file viewer
* Save to Dropbox
* Share buttons
* Google Analytics

### Font Awesome

Rather than using the default [Bootstrao Glyphicons](http://getbootstrap.com/components/#glyphicons), you can enable [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for beautiful, file-specific icons. Note that this will require extra resources, hence increase the load time.

### Theming

You can overwrite the `default` Bootstrap with any [Bootswatch](http://bootswatch.com/) theme (e.g. `united`) or add your `custom_theme` in the CDN settings. Please note that Bootswatch themes do not include [glyphicons](http://getbootstrap.com/components/#glyphicons).

### Viewer

To load images, videos, audio and source code into a [Bootstrap Modal](http://getbootstrap.com/javascript/#modals), the viewer is enabled by default. You can change this in `config.json`. The required Bootstrap JavaScript library will be added to your page automatically.

### Search Box

To filter files and folders displayed in the table, set `enable_search` to `true`. Additionally, you can enable `autofocus_search` set the focus to the search box on load.

### Syntax Highlighter

Source code in the viewer modal can be highlighted using [highlight.js](http://highlightjs.org/). Due to performance concerns when applied on huge files, the highlighter will only apply once the button at the bottom of the viewer modal is pressed.

## Contribute

1. Fork the repository
2. Make your changes
3. Send a pull request with your changes

## Credits

This project is built upon—or includes—code from the following people:

* Greg Johnson - [PHPDL lite](http://web.archive.org/web/20130920165711/http://greg-j.com/phpdl/) [Internet Archive]
* Na Wong - [Listr](http://nadesign.net/listr/)

Contributors:

* [@melalj](https://github.com/melalj) - subfolder support
* [@Zerquix18](https://github.com/Zerquix18) - security fixes

## License

The MIT License (MIT)

Copyright (c) 2014 Jan T. Sott

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Listr) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
