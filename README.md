# Bootstrap Listr [![Build Status](https://travis-ci.org/idleberg/Bootstrap-Listr.svg?branch=2.0-dev)](https://travis-ci.org/idleberg/Bootstrap-Listr)

A simple PHP script to display folders and files on a server in a well formed list, making use of the [Bootstrap 3.2](http://getbootstrap.com) framework.

*Watch a [live demo](http://demo.idleberg.com/Bootstrap-Listr-2.0-dev/)!*

## Installation

1. Clone the repository `git clone --branch=2.0-dev https://github.com/idleberg/Bootstrap-Listr.git` 
2. Change directory `cd Bootstrap-Listr`
3. Install all Node dependencies `npm install` and (optionally) Gulp `npm install gulp -g` 

## Building

### Local

#### Gulp tasks

Several [Gulp](http://gulpjs.com/) tasks are now available to build your local Listr app. You would usually follow these steps to do so:

    # create and populate "app/"
    gulp init

    # choose dependencies
    gulp setup

    # set Bootswatch theme (optional)
    # gulp theme

    # minify CSS, uglify JS
    gulp make

Steps 2-3 can be repeated anytime after the first. You also have `gulp clean`, `gulp upgrade` and `gulp lint` at hand, `gulp css`, `gulp js` & `gulp php` will lint the specific file-types.

#### Bash script

If for some reason you can't use Gulp, there is a bash script provided to perform most of the tasks. Run `./setup.sh` and follow instructions. As with the Gulp tasks, you can use `./setup.sh init`, `./setup.sh setup` and `./setup.sh theme` for individual steps of the script.

### CDN

Instead of running your dependencies locally, you can make use of various content delivery networks (CDN). Initialize your app using `gulp init` (or `setup.sh init`) and edit `config.json` to suit your needs, like setting a [Bootswatch theme](#theming).

## Deployment

Copy `app/` to your server, then rename `config.json-example` to `config.json` and edit your settings. All files that should be accessible through Bootstrap Listr go into the `_public` subfolder (you can change the folder in the config). You might have to enable the `RewriteBase` setting in the `.htaccess` file (and edit the folder name), depending on your Apache settings.

### Naming

If you prefer a different file name for the script, you can rename it without worrying about the ignore list. However, depending on your server, you might have declare the renamed file as your directory index.

* Apache: `DirectoryIndex myIndex.php` (see [documentation](http://httpd.apache.org/docs/2.2/mod/mod_dir.html))
* lighttpd: `index-file.names = ( "/myIndex.php" )` (see [documentation](http://redmine.lighttpd.net/projects/1/wiki/Docs_ModDirlisting))
* nginx: `index myIndex.php` (see [documentation](http://nginx.org/en/docs/http/ngx_http_index_module.html))

If you have config files for servers other than Apache, feel free to [share](#contribute) them.

## Options

You can configure a number of settings in the file `config.json`:

* Optional columns for size, modified date, permissions
* Document icons
* File viewer for images, videos, audio and source code
* Column sorting
* Responsive tables
* List of ignored files
* Default location for JavaScript libraries and style sheets
* Syntax highlighting in file viewer
* Save to Dropbox
* Share buttons
* Google Analytics

### Font Awesome

Rather than using generic icons, you can enable [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for beautiful, file-specific icons. Note that this will require extra resources, hence increase the load time. You can enable Font Awesome in `config.json`.

### Theming

Should you decide to use [Bootswatch](http://bootswatch.com/) (or any other) themes, please note that some of these do not include the [glyphicons](http://getbootstrap.com/components/#glyphicons) used in the script. You can disable glyphicons in `config.json`.

### Viewer

To load images, videos, audio and source code into a [Bootstrap Modal](http://getbootstrap.com/javascript/#modals), the viewer is enabled by default. You can change this in `config.json`. The required Bootstrap JavaScript library will be added to your page automatically.

#### Syntax Highlighter

Source code in the viewer modal can make use of [highlight.js](http://highlightjs.org/). To enable it, simply [provide sources](http://cdnjs.com/libraries/highlight.js/) for the JavaScript and style-sheets. Due to performance concerns when applied on huge files, the highlighter will only apply once the button at the bottom of the viewer modal is pressed.

### Libraries & Style-sheets

For your convenience, CDNs for Bootstrap and JQuery. Should you have reasons against this, you can change the default locations in `config.json`.

## Contribute

1. Fork the repository
2. Make your changes
3. Send a pull request with your changes

## Credits

This project is built upon—or includes—code from the following people:

* Greg Johnson - [PHPDL lite](http://web.archive.org/web/20130920165711/http://greg-j.com/phpdl/) [Internet Archive]
* Na Wong - [Listr](http://nadesign.net/listr/)
* Joe McCullough - [Stupid Table Plugin](http://joequery.github.io/Stupid-Table-Plugin/)

Contributors:

* [@melalj](https://github.com/melalj) - subfolder support
* [@Zerquix18](https://github.com/Zerquix18) - security fixes

## License

This work by Jan T. Sott is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US)

__Note:__ I am aware that Creative Commons [advises](http://wiki.creativecommons.org/FAQ#Can_I_apply_a_Creative_Commons_license_to_software.3F) against using their licenses for software. The choice hasn't been mine and I hope to resolve this issue in the future.

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Listr) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
