# Bootstrap Directory Lister

A simple PHP script to display folders and files on a server in a well form list, based on the style-sheets provided by [Bootstrap 3.0](http://getbootstrap.com)

![Screenshot](https://raw.github.com/idleberg/Bootstrap-Directory-Lister/master/screenshot.png)

## Installation

Clone this repository using `git clone https://github.com/idlerberg/Bootstrap-Directory-Lister` or use the [`Download ZIP`](https://github.com/idleberg/Bootstrap-Directory-Lister/archive/master.zip) option. Make sure to make `_bs-index.php` the directory index in your `.htaccess` file (see included example)

## Usage

You can configure the optional columns (size, age, permissions) and a list of ignored file names in in the header of the script file. If you prefer a different file name for the script, make sure to change it along the `DirectoryIndex` and add it to the ignore list.

## Credits

This project is based on Na Wong's [Listr](http://nadesign.net/listr/), which itself is based on Greg Johnson's [PHP Directory Lister](http://greg-j.com/phpdl/).

## License

This work is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US).

## Donate

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Directory-Lister)