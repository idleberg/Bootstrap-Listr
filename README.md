# Bootstrap Directory Lister

A simple PHP script to display folders and files on a server in a well form list, based on the style-sheets provided by [Bootstrap 3.0](http://getbootstrap.com)

[View a demo](http://demo.idleberg.com/Little-Printer-APOD/)

## Installation

Clone this repository using `git clone https://github.com/idleberg/Bootstrap-Directory-Lister` or [`download`](https://raw.github.com/idleberg/Bootstrap-Directory-Lister/master/index.php) the raw file.

## Usage

### Options

You can configure some of the settings in the header of the script file. Currently, these includ the following:

* Optional columns for size, modified date, permissions (the latter is disabled by default)
* Document icons (enabled by default)
* Column sorting (enabled by default)
* List of ignored files

### File name

If you prefer a different file name for the script, don't forget to add it as new `DirectoryIndex`. Please refer to the [Apache documation](http://httpd.apache.org/docs/2.2/mod/mod_dir.html) for details.

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

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Directory-Lister)