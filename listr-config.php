<?php

/*** SETTINGS ***/

/* Path where your files & folders are located
 */
define(FOLDER_ROOT, './_public/');

/* Table Styles (can be combined, e.g. 'table-hover table-striped')
 *     'table-hover' - enable a hover state on table rows (default)
 *   'table-striped' - add zebra-striping 
 *  'table-bordered' - show borders on all sides of the table and cells
 * 'table-condensed' - make tables more compact by cutting cell padding in half
 */
define(TABLE_STYLE, 'table-hover');

/* Responsive Table
 * See http://getbootstrap.com/css/#tables-responsive for details
 */
define(RESPONSIVE_TABLE, true);

// Toggle column sorting
define(ENABLE_SORT, true);

// Toggle media viewer
define(ENABLE_VIEWER, true);

/* Size of modal used for media viewer (pixel widths refer to standard theme)
 * 'modal-sm' - 300px
 *         '' - 600px
 * 'modal-lg' - 900px (default)
 */
define(MODAL_SIZE, 'modal-lg');

/* Document Icons:
 *         'none' - No icons
 *   'glyphicons' - Bootstrap glyphicons
 *  'fontawesome' - Font Awesome icons (default)
 */
define(DOC_ICONS, 'fontawesome');

/* Bootstrap Themes:
 *    'default' - http://getbootstrap.com
 * 
 *     'amelia' - http://bootswatch.com/amelia/
 *   'cerulean' - http://bootswatch.com/cerulean/
 *      'cosmo' - http://bootswatch.com/cosmo/
 *     'cyborg' - http://bootswatch.com/cyborg/
 *     'darkly' - http://bootswatch.com/darkly/
 *     'flatly' - http://bootswatch.com/flatly/
 *    'journal' - http://bootswatch.com/journal/
 *      'lumen' - http://bootswatch.com/lumen/
 *   'readable' - http://bootswatch.com/readable
 *    'simplex' - http://bootswatch.com/simplex
 *      'slate' - http://bootswatch.com/slate/
 *   'spacelab' - http://bootswatch.com/spacelab/
 *  'superhero' - http://bootswatch.com/superhero/
 *     'united' - http://bootswatch.com/united
 *       'yeti' - http://bootswatch.com/yeti/
 */
define(BOOTSTRAP_THEME, 'flatly');

/* Font Awesome Styles (can be combined, e.g. 'fa-lg fa-border'):
 *      'fa-fw' – fixed width (default)
 *      'fa-lg' – 33% increase
 *      'fa-2x' – 2x size
 *      'fa-3x' – 3x size
 *      'fa-4x' – 4x size
 *      'fa-5x' – 5x size
 *  'fa-border' – display border around icon
 *
 * Visit http://fontawesome.io/examples/ for further options
 */
define(FONTAWESOME_STYLE,'fa-fw');

// External resources
   define(FONT_AWESOME, '//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css');
     define(CUSTOM_THEME, null);
    define(GOOGLE_FONT, null); // e.g. 'Open+Sans' or 'Open+Sans:400,300,700'
         define(JQUERY, '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js');
    define(BOOTSTRAPJS, '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js');

// Browser and Device Icons
          define(FAV_ICON, ''); // 16x16 or 32x32 
       define(IPHONE_ICON, ''); // 57x57
define(IPHONE_ICON_RETINA, ''); // 114x114
         define(IPAD_ICON, ''); // 72x72
  define(IPAD_ICON_RETINA, ''); // 144x144
  define(METRO_TILE_COLOR, ''); //
  define(METRO_TILE_IMAGE, ''); // 144x144

// Display link to Bootstrap-Listr in footer
define(GIVE_KUDOS, true);

// Google Analytics ID
define(ANALYTICS_ID, ''); // UA-XXXXX-Y or UA-XXXXX-YY

// Configure optional table columns
$table_options = array (
    'size'    => true,
    'age'    => true
);

// Set sorting properties.
$sort = array(
    array('key'=>'lname',    'sort'=>'asc'), // ... this sets the initial sort "column" and order ...
    array('key'=>'size',    'sort'=>'asc') // ... for items with the same initial sort value, sort this way.
);

// Files you want to hide form the listing
$ignore_list = array(
    '.DAV',
    '.DS_Store',
    '.bzr',
    '.bzrignore',
    '.bzrtags',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitmodules',
    '.hg',
    '.hgignore',
    '.hgtags',
    '.htaccess',
    '.htpasswd',
    '.jshintrc',
    '.npmignore',
    '.Spotlight-V100',
    '.svn',
    '__MACOSX',
    'ehthumbs.db',
    'robots.txt',
    'Thumbs.db'
);

// Hide file extension?
define(HIDE_EXTENSION, false);

?>