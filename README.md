# Bootstrap Listr

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/idleberg/Bootstrap-Listr.svg?style=flat-square)](https://github.com/idleberg/Bootstrap-Listr/releases)
[![Travis](https://img.shields.io/travis/idleberg/Bootstrap-Listr.svg?style=flat-square)](https://travis-ci.org/idleberg/Bootstrap-Listr)
[![David](https://img.shields.io/david/dev/idleberg/Bootstrap-Listr.svg?style=flat-square)](https://david-dm.org/idleberg/Bootstrap-Listr#info=devDependencies)

A replacement for default server indices, Bootstrap Listr beautifully displays folders and files in the browser. It is built upon the [Bootstrap](http://getbootstrap.com) framework and [Font Awesome](http://fortawesome.github.io/Font-Awesome/) icons, optionally [Bootswatch](http://bootswatch.com/) themes can be used.

*Watch a [live demo](https://idleberg.com/demo/Bootstrap-Listr-2/) (latest [alpha-version](https://idleberg.com/demo/Bootstrap-Listr-2.3-alpha)!)*

## Installation

Download the [latest release](https://github.com/idleberg/Bootstrap-Listr/releases/latest) or clone the repository.

## Building

### Gulp

[Gulp](http://gulpjs.com/) tasks are used to configure and build your application.

To build a clean copy of Bootstrap Listr, run the make script:

```bash
npm run-script make
```

Alternatively, you can now run the individual Gulp tasks on their own. See `gulp help` for a list of available tasks.

## Deployment

Deploy `build/` to your server. All files that should be accessible in the browser go into the `_public` folder (you can define a different folder in the `config.json). Depending on your Apache settings, you might have to uncomment the `RewriteBase` setting in the `.htaccess` file (maybe add folder name after the slash.)

## Options

You can configure a number of settings in the file `config.json`:

* Optional columns for size, modified date, permissions
* Document icons
* File viewer for images, videos, audio, source code, PDF and HTML
* Search box to filter results
* Column sorting
* Responsive tables
* List of ignored files
* List of hidden files
* Default location for JavaScript libraries and style sheets (CDN or local)
* Syntax highlighting in file viewer
* Save to Dropbox
* Share buttons
* Google Analytics
* Language
* Virtual files

Please visit the [project wiki](https://github.com/idleberg/Bootstrap-Listr/wiki/Understanding-config.json) for details.

## Support

It's always a good start to consult the [FAQ](https://github.com/idleberg/Bootstrap-Listr/wiki/FAQ) or the [project wiki](https://github.com/idleberg/Bootstrap-Listr/wiki) in general.

### Issues

Report issue or suggest new features only on [GitHub](https://github.com/idleberg/Bootstrap-Listr/issues)!

### Contribute

To contribute patches, follow this standard procedure:

1. Fork the repository
2. Make your changes to the development branch
3. Communicate your changes
4. Send a pull request with your changes

### Talk

For user specific problems or just to have a chat with the developers, feel free to join our [Gitter](https://gitter.im/idleberg/Bootstrap-Listr) channel.

## Credits

This project is built upon—or includes—code from the following people:

* Greg Johnson - [PHPDL lite](http://web.archive.org/web/20130920165711/http://greg-j.com/phpdl/) [Internet Archive]
* Na Wong - [Listr](http://nadesign.net/listr/)

Contributors:

* [@melalj](https://github.com/melalj) - subfolder support
* [@Zerquix18](https://github.com/Zerquix18) - security fixes

## License

This work is licensed under the [The MIT License](LICENSE.md).

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/Bootstrap-Listr) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
