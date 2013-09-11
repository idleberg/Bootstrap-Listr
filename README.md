# Bootstrap Directory Lister

A simple PHP script to display folders and files on a server in a well form list, based on the style-sheets provided by [Bootstrap 3.0](http://getbootstrap.com)

![Screenshot](https://raw.github.com/idleberg/Bootstrap-Directory-Lister/master/screenshot.png)

## Installation

Clone this repository using `git clone https://github.com/idlerberg/Bootstrap-Directory-Lister` or use the [`Download ZIP`](https://github.com/idleberg/Bootstrap-Directory-Lister/archive/master.zip) option.

## Usage

Once all files are placed on your server, make sure to set the directory index to `DirectoryIndex _bs-index.php` - assuming you are using Apache. If you prefer a different naming scheme, rename the file and the entry accordingly.

Within the actual script, you can also define a list of ignored files. By default, this list includes `_bs-index.php` and `_bs-dist`.

## Credits

This project is based on Na Wong's [Listr](http://nadesign.net/listr/), which is based on Greg Johnson's' [PHP Directory Lister](http://greg-j.com/phpdl/).

## License

This work is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US).

## Donate

[![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Directory-Lister)