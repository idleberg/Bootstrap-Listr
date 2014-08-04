# Bootstrap Listr

A simple PHP script to display folders and files on a server in a well formed list, making use of the [Bootstrap 3.2](http://getbootstrap.com) framework.

*Watch a [live demo](http://demo.idleberg.com/Bootstrap-Listr)!*

## Installation

### GitHub

Download the latest [stable release](https://github.com/idleberg/Bootstrap-Listr/releases) or clone the repository for the latest bleeding-edge development version.

## Usage

Once you deployed to your server, move all your files to the `_public` subfolder (change the folder in the head of the script). You might have to enable the `RewriteBase` setting in the `.htaccess` file (and edit the folder name), depending on your Apache settings.

### Options

You can configure a number of settings in the header of the script file:

* Optional columns for size, modified date, permissions
* Document icons
* Column sorting
* Responsive tables
* List of ignored files
* Default location for JavaScript libraries and style sheets
* Google Analytics

### Naming

If you prefer a different file name for the script, you can rename it without worrying about the ignore list. However, depending on your server, you might have declare the renamed file as your directory index.

* Apache: `DirectoryIndex myIndex.php` (see [documentation](http://httpd.apache.org/docs/2.2/mod/mod_dir.html))
* lighttpd: `index-file.names = ( "/myIndex.php" )` (see [documentation](http://redmine.lighttpd.net/projects/1/wiki/Docs_ModDirlisting))
* nginx: `index myIndex.php` (see [documentation](http://nginx.org/en/docs/http/ngx_http_index_module.html))


### Font Awesome

Rather than using generic icons, you can enable [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for beautiful, file-specific icons. Note that this will require extra resources, hence increase the load time.

### Theming

Should you decide to use [Bootswatch](http://bootswatch.com/) (or any other) themes, please note that some of these do not include the [glyphicons](http://getbootstrap.com/components/#glyphicons) used in the script. You can disable glyphicons in the script header or use Font Awesome icons instead.

### Viewer

To load images, videos and audio into a [Bootstrap Modal](http://getbootstrap.com/javascript/#modals), you can enable the viewer in the script header. The required Bootstrap JavaScript library will be added to your page automatically.

### Libraries & Style-sheets

For your convenience, CDNs for Bootstrap and JQuery. Should you have reasons against this, you can change the default locations in the script header.

## Credits

This project is built upon—or includes—code from the following people:

* Greg Johnson - [PHPDL lite](http://web.archive.org/web/20130920165711/http://greg-j.com/phpdl/) [Internet Archive]
* Na Wong - [Listr](http://nadesign.net/listr/)
* Joe McCullough - [Stupid Table Plugin](http://joequery.github.io/Stupid-Table-Plugin/)

Thanks to [melalj](https://github.com/melalj) and [Zerquix18](https://github.com/Zerquix18) for contributing code to make this project better!

## License

This work by Jan T. Sott is licensed under a [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/deed.en_US)

__Note:__ I am aware that Creative Commons [advises](http://wiki.creativecommons.org/FAQ#Can_I_apply_a_Creative_Commons_license_to_software.3F) against using their licenses for software. The choice hasn't been mine and I hope to resolve this issue in the future.

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Listr) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
