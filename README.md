# Bootstrap Listr

A simple PHP script to display folders and files on a server in a well form list, based on the style-sheets provided by [Bootstrap 3](http://getbootstrap.com).

![Screenshot](https://raw.github.com/idleberg/Bootstrap-Listr/gh-pages/images/screenshot-font_awesome.png)

*Screenshot: Example with [Font Awesome](http://fortawesome.github.io/Font-Awesome/) icons enabled*

For examples using different configurations, have a look at the [live demos](http://demo.idleberg.com/Bootstrap-Listr)!

## Installation

Clone this repository using `git clone https://github.com/idleberg/Bootstrap-Listr` or [`download`](https://raw.github.com/idleberg/Bootstrap-Listr/master/index.php) the raw file.

## Usage

### Options

You can configure a number of settings in the header of the script file:

* Optional columns for size, modified date, permissions
* Document icons
* Column sorting
* Viewport
* List of ignored files
* Default location for JavaScript libraries and style sheets

### Naming

If you prefer a different file name for the script, you can rename it without worrying about the ignore list. Just don't forget to add it as new `DirectoryIndex`. Please refer to the [Apache documation](http://httpd.apache.org/docs/2.2/mod/mod_dir.html) for details.

### Font Awesome

Rather than using generic icons, you can enable [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for file-specific icons. Note that this will require extra resources, hence increase the load time.

### Theming

Should you decide to use [Bootswatch](http://bootswatch.com/) (or any other) themes, please note that some of these do not include the [glyphicons](http://getbootstrap.com/components/#glyphicons) used in the script. You can disable glyphicons in the script header.

## Credits

This project is built upon—or includes—code from the following people:

* Greg Johnson - [PHP Directory Lister](http://greg-j.com/phpdl/)
* Na Wong - [Listr](http://nadesign.net/listr/)
* Joe McCullough - [Stupid Table Plugin](http://joequery.github.io/Stupid-Table-Plugin/)

## License

This work by Jan T. Sott is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US)

## Donate

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Listr)