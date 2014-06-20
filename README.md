# Bootstrap Listr

A simple PHP script to display folders and files on a server in a well formed list, making use of the [Bootstrap 3.1](http://getbootstrap.com) framework.

![Screenshot](https://raw.github.com/idleberg/Bootstrap-Listr/gh-pages/images/screenshot-font_awesome.png)  
*Screenshot: Example with [Font Awesome](http://fortawesome.github.io/Font-Awesome/) icons enabled*

For examples using different configurations, have a look at the [live demos](http://demo.idleberg.com/Bootstrap-Listr)!

## Installation

### GitHub ###

Clone this repository using `git clone https://github.com/idleberg/Bootstrap-Listr` or [`download`](https://raw.github.com/idleberg/Bootstrap-Listr/master/index.php) the raw file.

### robots.txt ###

The basic file you're after is `index.php`, but the repository also comes with a restrictive `robots.txt` file. Should you wish your page to be indexed by web crawlers et al, you can delete the file or adjust its [settings](http://www.robotstxt.org/robotstxt.html).

Also note that by default, `index.php` has `robots.txt` on its ignore-list, meaning the file will be hidden in the view.

## Usage

You put `index.php` and `.htaccess` on the directory where you want to have access to the directory listing (for example `http://localhost/resources/`).

The files/directories that you want to show to public have to be inside the folder `_public` (keep the .htaccess file that is inside it).

(For example you may access to your file.txt like this `http://localhost/resources/file.txt`, while in the server it's located in `/resources/_public/file.txt`)


### Options

You can configure a number of settings in the header of the script file:

* Public directory name
* Optional columns for size, modified date, permissions
* Document icons
* Column sorting
* Responsive tables
* List of ignored files
* Default location for JavaScript libraries and style sheets
* Google Analytics

### Font Awesome

Rather than using generic icons, you can enable [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for beautiful, file-specific icons. Note that this will require extra resources, hence increase the load time.

### Theming

Should you decide to use [Bootswatch](http://bootswatch.com/) (or any other) themes, please note that some of these do not include the [glyphicons](http://getbootstrap.com/components/#glyphicons) used in the script. You can disable glyphicons in the script header or use Font Awesome icons instead.

### Libraries & Style-sheets

For your convenience, we use CDNs for Bootstrap and JQuery. Should you have reasons against this, you can change the default locations in the script header.

## Credits

This project is built upon—or includes—code from the following people:

* Greg Johnson - [PHPDL lite](http://web.archive.org/web/20130920165711/http://greg-j.com/phpdl/) [Internet Archive]
* Na Wong - [Listr](http://nadesign.net/listr/)
* Joe McCullough - [Stupid Table Plugin](http://joequery.github.io/Stupid-Table-Plugin/)

## License

This work by Jan T. Sott is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US)

__Note:__ I am aware that Creative Commons [advises](http://wiki.creativecommons.org/FAQ#Can_I_apply_a_Creative_Commons_license_to_software.3F) against using their licenses for software. The choice hasn't been mine and I hope to resolve this issue in the future.

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Listr) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
