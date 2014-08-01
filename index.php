<?php

error_reporting(1);

/**
 *      Bootstrap Listr
 *
 *       Author:    Jan T. Sott
 *         Info:    http://github.com/idleberg/Bootstrap-Listr
 *      License:    Creative Commons Attribution-ShareAlike 3.0
 *
 *      Credits:    Greg Johnson - PHPDL lite (http://greg-j.com/phpdl/)
 *                  Na Wong - Listr (http://nadesign.net/listr/)
 *                  Joe McCullough - Stupid Table Plugin (http://joequery.github.io/Stupid-Table-Plugin/)
 */


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
define(ENABLE_VIEWER, false);

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
define(DOC_ICONS, 'glyphicons');

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
define(BOOTSTRAP_THEME, 'default');

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
    '.hg',
    '.hgignore',
    '.hgtags',
    '.htaccess',
    '.htpasswd',
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

// Get this folder and files name.
$this_script = basename(__FILE__);

$get_path = (isset($_GET['path'])) ? $_GET['path'] : "";
$this_folder = str_replace('..', '', $get_path);
$this_folder = str_replace($this_script, '', $this_folder);
$this_folder = str_replace('index.php', '', $this_folder);
$this_folder = str_replace('//', '/', $this_folder);

$navigation_dir = FOLDER_ROOT .$this_folder;

$absolute_path = str_replace(str_replace("%2F", "/", rawurlencode($this_folder)), '', $_SERVER['REQUEST_URI']);
$dir_name = explode("/", $this_folder);


if(substr($navigation_dir, -1) != "/"){
	if (file_exists($navigation_dir)) {

		// GET MIME 
		$mime_file = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $navigation_dir);
		
		// Direct download
		if($mime_file == "inode/x-empty" || $mime_file == ""){
			header('Content-Description: File Transfer');
			header('Content-Type: application/octet-stream');
			header('Content-Disposition: attachment; filename="'.basename($navigation_dir).'"');
		}
		// Recognizable mime
		else{
			header('Content-Type: ' . $mime_file);
		}
		header('Expires: 0');
		header('Cache-Control: must-revalidate');
		header("Accept-Ranges: bytes");
		header('Pragma: public');
		header('Content-Length: ' . filesize($navigation_dir));
		ob_clean();
		flush();
		readfile($navigation_dir);
		exit;	    
	}
	else{
		echo "404 — Not found";
	}
	exit;
}

// Declare vars used beyond this point.
$file_list = array();
$folder_list = array();
$total_size = 0;

if (DOC_ICONS == "glyphicons") { 
    $icon_tag = 'span';
} else if (DOC_ICONS == "fontawesome") { 
    $icon_tag = 'i';
}

if (DOC_ICONS == 'fontawesome') {
    $filetype = array(
        'archive'   => array('7z','ace','adf','air','apk','arj','bz2','bzip','cab','d64','dmg','git','hdf','ipf','iso','fdi','gz','jar','lha','lzh','lz','lzma','pak','phar','pkg','pimp','rar','safariextz','sfx','sit','sitx','sqx','sublime-package','swm','tar','tgz','wim','wsz','xar','zip'),
        'apple'     => array('app','ipa','ipsw','saver'),
        'audio'     => array('aac','ac3','aif','aiff','au','caf','flac','it','m4a','m4p','med','mid','mo3','mod','mp1','mp2','mp3','mpc','ned','ra','ram','oga','ogg','oma','s3m','sid','umx','wav','webma','wv','xm'),
        'calendar'  => array('icbu','ics'),
        'config'    => array('cfg','conf','ini','htaccess','htpasswd','plist','sublime-settings','xpy'),
        'contact'   => array('abbu','contact','oab','pab','vcard','vcf'),
        'database'  => array('bde','crp','db','db2','db3','dbb','dbf','dbk','dbs','dbx','edb','fdb','frm','fw','fw2','fw3','gdb','itdb','mdb','ndb','nsf','rdb','sas7mdb','sql','sqlite','tdb','wdb'),
        'doc'       => array('abw','doc','docm','docs','docx','dot','key','numbers','odb','odf','odg','odp','odt','ods','otg','otp','ots','ott','pages','pdf','pot','ppt','pptx','sdb','sdc','sdd','sdw','sxi','wp','wp4','wp5','wp6','wp7','wpd','xls','xlsx','xps'),
        'downloads' => array('!bt','!qb','!ut','crdownload','download','opdownload','part'),
        'ebook'     => array('aeh','azw','ceb','chm','epub','fb2','ibooks','kf8','lit','lrf','lrx','mobi','pdb','pdg','prc','xeb'),
        'email'     => array('eml','emlx','mbox','msg','pst'),
        'feed'      => array('atom','rss'),
        'font'      => array('eot','fon','otf','pfm','ttf','woff'),
        'image'     => array('ai','bmp','cdr','emf','eps','gif','icns','ico','jp2','jpe','jpeg','jpg','jpx','pcx','pict','png','psd','psp','svg','tga','tif','tiff','webp','wmf'),
        'link'      => array('lnk','url','webloc'),
        'linux'     => array('bin','deb','rpm'),
        'palette'   => array('ase','clm','clr','gpl'),
        'raw'       => array('3fr','ari','arw','bay','cap','cr2','crw','dcs','dcr','dnf','dng','eip','erf','fff','iiq','k25','kdc','mdc','mef','mof','mrw','nef','nrw','obm','orf','pef','ptx','pxn','r3d','raf','raw','rwl','rw2','rwz','sr2','srf','srw','x3f'),
        'script'    => array('ahk','as','asp','aspx','bat','c','cfm','clj','cmd','cpp','css','el','erb','g','hml','java','js','json','jsp','less','nsh','nsi','php','php3','pl','py','rb','rhtml','sass','scala','scm','scpt','scptd','scss','sh','shtml','wsh','xml','yml'),
        'text'      => array('ans','asc','ascii','csv','diz','latex','log','markdown','md','nfo','rst','rtf','tex','text','txt'),
        'video'     => array('3g2','3gp','3gp2','3gpp','asf','avi','bik','bup','divx','flv','ifo','m4v','mkv','mkv','mov','mp4','mpeg','mpg','rm','rv','ogv','qt','smk','swf','vob','webm','wmv','xvid'),
        'website'   => array('htm','html','mhtml','mht','xht','xhtml'),
        'windows'   => array('dll','exe','msi','pif','ps1','scr','sys')
    );
    $home = "<i class=\"fa fa-home fa-lg fa-fw\"></i> ";
} else{
    if (DOC_ICONS == 'glyphicons') {
        $home = "<span class=\"glyphicon glyphicon-home\"></span>";
    } else {
        $home = $this_domain;
    }    
}
if (ENABLE_VIEWER) {
    $audio_files     = array('m4a','mp3','oga','ogg','webma','wav');
    $image_files     = array('gif','jpe','jpeg','jpg','png','svg','webp');
    $quicktime_files = array('3g2','3gp','3gp2','3gpp','mov','qt');
    $source_files    = array('bat','cmd','css','hml','htaccess','htpasswd','js','json','less','sass','scpt','scss','sh','xml','yml');
    $video_files     = array('mp4','m4v','ogv','webm');
}

if (CUSTOM_THEME) {
    $bootstrap_cdn = CUSTOM_CSS;
} else {
    $cdn_pre = '//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/';
    $cdn_post = '/bootstrap.min.css';
    $bootswatch = array('amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','readable','simplex','slate','spacelab','superhero','united','yeti');

    if (in_array(BOOTSTRAP_THEME, $bootswatch)) {
        $bootstrap_cdn = '//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/'.BOOTSTRAP_THEME.'/bootstrap.min.css';
    } else {
        $bootstrap_cdn = '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css';
    }
}

// Count optional columns
$table_count = 0;
foreach($table_options as $value)
{
  if($value === true)
    $table_count++;
}

// Open the current directory...
if ($handle = opendir($navigation_dir))
{
    // ...start scanning through it.
    while (false !== ($file = readdir($handle)))
    {
        // Make sure we don't list this folder,file or their links.
        if ($file != "." && $file != ".." && $file != $this_script && !in_array($file, $ignore_list) && (substr($file, 0, 1) != '.'))
        {
            // Get file info.
            $info                  =    pathinfo($file);
            // Organize file info.
            $item['name']          =     $info['filename'];
            $item['lname']         =     strtolower($info['filename']);
            $item['bname']         =     $info['basename'];
            $item['lbname']        =     strtolower($info['basename']);
            $item['ext']           =     $info['extension'];
            $item['lext']          =     strtolower($info['extension']);
            if($info['extension'] == '') $item['ext'] = '.';

            if (DOC_ICONS == 'fontawesome') {
                $folder_icon = 'fa fa-folder ' . FONTAWESOME_STYLE;
                if(in_array($item['lext'], $filetype['archive'])){
                    $item['class'] = 'fa fa-archive ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['apple'])){
                    $item['class'] = 'fa fa-apple ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['audio'])){
                    $item['class'] = 'fa fa-music ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['calendar'])){
                    $item['class'] = 'fa fa-calendar ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['config'])){
                    $item['class'] = 'fa fa-cogs ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['contact'])){
                    $item['class'] = 'fa fa-group ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['database'])){
                    $item['class'] = 'fa fa-database ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['doc'])){
                    $item['class'] = 'fa fa-file-text ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['downloads'])){
                    $item['class'] = 'fa fa-cloud-download ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['ebook'])){
                    $item['class'] = 'fa fa-book ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['email'])){
                    $item['class'] = 'fa fa-envelope ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['feed'])){
                    $item['class'] = 'fa fa-rss ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['font'])){
                    $item['class'] = 'fa fa-font ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['image'])){
                    $item['class'] = 'fa fa-picture-o ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['link'])){
                    $item['class'] = 'fa fa-link ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['linux'])){
                    $item['class'] = 'fa fa-linux ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['palette'])){
                    $item['class'] = 'fa fa-tasks ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['raw'])){
                    $item['class'] = 'fa fa-camera ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['script'])){
                    $item['class'] = 'fa fa-code ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['text'])){
                    $item['class'] = 'fa fa-file-text-o ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['video'])){
                    $item['class'] = 'fa fa-film ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['website'])){
                    $item['class'] = 'fa fa-globe ' . FONTAWESOME_STYLE;
                }elseif(in_array($item['lext'], $filetype['windows'])){
                    $item['class'] = 'fa fa-windows ' . FONTAWESOME_STYLE;
                }else{
                    $item['class'] = 'fa fa-file-o ' . FONTAWESOME_STYLE;        
                }
            } else {
                $folder_icon   = 'glyphicon glyphicon-folder-close';
                $item['class'] = 'glyphicon glyphicon-file';
            }

			if ($table_options['size'] || $table_options['age'])
				$stat				=	stat($navigation_dir.$file); // ... slow, but faster than using filemtime() & filesize() instead.

			if ($table_options['size']) {
				$item['bytes']		=	$stat['size'];
				$item['size']		=	bytes_to_string($stat['size'], 2);
			}

			if ($table_options['age']) {
				$item['mtime']		=	$stat['mtime'];
			}
			
			// Add files to the file list...
			if(is_dir($navigation_dir.$file)){
				array_push($folder_list, $item);
			}
			// ...and folders to the folder list.
			else{
				array_push($file_list, $item);
			}
			// Clear stat() cache to free up memory (not really needed).
			clearstatcache();
			// Add this items file size to this folders total size
			$total_size += $item['bytes'];
        }
    }
    // Close the directory when finished.
    closedir($handle);
}
// Sort folder list.
if($folder_list)
    $folder_list = php_multisort($folder_list, $sort);
// Sort file list.
if($file_list)
    $file_list = php_multisort($file_list, $sort);
// Calculate the total folder size (fix: total size cannont display while there is no folder inside the directory)
if($file_list && $folder_list || $file_list)
    $total_size = bytes_to_string($total_size, 2);

$total_folders = count($folder_list);
$total_files = count($file_list);

$contained = "";
if ($total_folders > 0){
    if ($total_folders > 1){
        $funit = 'folders';
    }else{
        $funit = 'folder';
    }
    $contained = $total_folders.' '.$funit;
}
if ($total_files > 0){
	if($total_files > 1){
		$iunit = 'files';
	}else{
		$iunit = 'file';
	}
	if ($total_folders > 0){
		$contained .= ' and ';
	}
	if (isset($contained)){
		$contained .= $total_files.' '.$iunit;
	}else{
		$contained = $total_files.' '.$iunit;	
	}
	$contained = $contained.', '.$total_size['num'].' '.$total_size['str'].' in total';
}

/*** FUNCTIONS ***/

/**
 *    http://us.php.net/manual/en/function.array-multisort.php#83117
 */
 
function php_multisort($data,$keys)
{
    foreach ($data as $key => $row)
    {
        foreach ($keys as $k)
        {
            $cols[$k['key']][$key] = $row[$k['key']];
        }
    }
    $idkeys = array_keys($data);
    $i=0;
    foreach ($keys as $k)
    {
        if($i>0){$sort.=',';}
        $sort.='$cols['.$k['key'].']';
        if($k['sort']){$sort.=',SORT_'.strtoupper($k['sort']);}
        if($k['type']){$sort.=',SORT_'.strtoupper($k['type']);}
        $i++;
    }
    $sort .= ',$idkeys';
    $sort = 'array_multisort('.$sort.');';
    eval($sort);
    foreach($idkeys as $idkey)
    {
        $result[$idkey]=$data[$idkey];
    }
    return $result;
} 

/**
 *    @ http://us3.php.net/manual/en/function.filesize.php#84652
 */
function bytes_to_string($size, $precision = 0) {
    $sizes = array('YB', 'ZB', 'EB', 'PB', 'TB', 'GB', 'MB', 'KB', 'bytes');
    $total = count($sizes);
    while($total-- && $size > 1024) $size /= 1024;
    $return['num'] = round($size, $precision);
    $return['str'] = $sizes[$total];
    return $return;
}

/**
 *    @ http://us.php.net/manual/en/function.time.php#71342
 */
function time_ago($timestamp, $recursive = 0)
{
    $current_time = time();
    $difference = $current_time - $timestamp;
    $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
    $lengths = array(1, 60, 3600, 86400, 604800, 2630880, 31570560, 315705600);
    for ($val = sizeof($lengths) - 1; ($val >= 0) && (($number = $difference / $lengths[$val]) <= 1); $val--);
    if ($val < 0) $val = 0;
    $new_time = $current_time - ($difference % $lengths[$val]);
    $number = floor($number);
    if($number != 1)
    {
        $periods[$val] .= "s";
    }
    $text = sprintf("%d %s ", $number, $periods[$val]);   
    
    if (($recursive == 1) && ($val >= 1) && (($current_time - $new_time) > 0))
    {
        $text .= time_ago($new_time);
    }
    return $text;
}


/*** HTML LOGIC ***/

// Set HTML header
$header = "  <meta charset=\"utf-8\">" . PHP_EOL;
$header = $header."  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=yes\">" . PHP_EOL;
$header = $header."  <meta name=\"generator\" content=\"Bootstrap Listr\" />" . PHP_EOL;
$header = $header."  <title>Index of $this_domain$this_folder</title>" . PHP_EOL;
if (FAV_ICON) $header = $header."  <link rel=\"shortcut icon\" href=\"".FAV_ICON."\" />" . PHP_EOL;
if (IPHONE_ICON) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"57x57\" href=\"".IPHONE_ICON."\" />" . PHP_EOL;
if (IPHONE_ICON_RETINA) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\"".IPHONE_ICON_RETINA."\" />" . PHP_EOL;
if (IPAD_ICON) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\"".IPAD_ICON."\" />" . PHP_EOL;
if (IPAD_ICON_RETINA) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"144x144\" href=\"".IPAD_ICON_RETINA."\" />" . PHP_EOL;
if (METRO_TILE_COLOR) $header = $header."  <meta name=\"msapplication-TileColor\" content=\"#".METRO_TILE_COLOR."\" />" . PHP_EOL;
if (METRO_TILE_IMAGE) $header = $header."  <meta name=\"msapplication-TileImage\" content=\"#".METRO_TILE_IMAGE."\" />" . PHP_EOL;
$header = $header."  <link rel=\"stylesheet\" href=\"$bootstrap_cdn\" />" . PHP_EOL;
if (DOC_ICONS == "fontawesome") {
    $header = $header."  <link rel=\"stylesheet\" href=\"".FONT_AWESOME."\" />" . PHP_EOL;
}
if (ENABLE_VIEWER) {
    $modal_css = ".modal img{display:block;margin:0 auto;max-width:100%}.modal video,.modal audio{width:100%}.viewer-wrapper{position:relative;padding-bottom:56.25%;height:0},.viewer-wrapper embed,.viewer-wrapper object{position:absolute;top:0;left:0;width:100%;height:100%}";
}
$header = $header."  <style type=\"text/css\">th{cursor:pointer}".$modal_css."</style>" . PHP_EOL;
if (GOOGLE_FONT) {
$header = $header."  <link href=\"//fonts.googleapis.com/css?family=".GOOGLE_FONT."\" rel=\"stylesheet\" type=\"text/css\">" . PHP_EOL;
}

// Set HTML footer
if ( (ENABLE_SORT) || (ENABLE_VIEWER) ) {
    $footer = $footer."  <script type=\"text/javascript\" src=\"".JQUERY."\"></script>" . PHP_EOL;
}
if (ENABLE_VIEWER) {
    $footer = $footer."  <script type=\"text/javascript\" src=\"".BOOTSTRAPJS."\"></script>" . PHP_EOL;
    $footer = $footer."  <script type=\"text/javascript\">$(\".audio-modal\").click(function(e){e.preventDefault();var t=$(this).attr(\"href\");$(\".modal-body\").empty().append('<audio src=\"'+t+'\" id=\"player\" autoplay controls>Your browser does not support the audio element.</audio>'),$(\".fullview\").attr(\"href\",t).text(\"Listen\"),$(\".modal-title\").text(t),$(\"#viewer-modal\").modal(\"show\")});$(\".flash-modal\").click(function(e){e.preventDefault();var t=$(this).attr(\"href\");$(\".modal-body\").empty().append('<div class=\"viewer-wrapper\"><object width=\"100%\" height=\"100%\" type=\"application/x-shockwave-flash\" data=\"'+t+'\"><param name=\"movie\" value=\"'+t+'\"><param name=\"quality\" value=\"high\"></object></div>'),$(\".fullview\").attr(\"href\",t).text(\"View\"),$(\".modal-title\").text(t),$(\"#viewer-modal\").modal(\"show\")});$(\".image-modal\").click(function(e){e.preventDefault();var t=$(this).attr(\"href\");$(\".modal-body\").empty().append('<img src=\"'+t+'\"/>'),$(\".fullview\").attr(\"href\",t).text(\"View\"),$(\".modal-title\").text(t),$(\"#viewer-modal\").modal(\"show\")});$(\".video-modal\").click(function(e){e.preventDefault();var t=$(this).attr(\"href\");$(\".modal-body\").empty().append('<video src=\"'+t+'\" id=\"player\" autoplay controls>Video format or MIME type is not supported</video>'),$(\".fullview\").attr(\"href\",t).text(\"View\"),$(\".modal-title\").text(t),$(\"#viewer-modal\").modal(\"show\")});$(\".quicktime-modal\").click(function(e){e.preventDefault();var t=$(this).attr(\"href\");$(\".modal-body\").empty().append('<div class=\"viewer-wrapper\"><embed width=\"100%\" height=\"100%\" src=\"'+t+'\" type=\"video/quicktime\" controller=\"true\" showlogo=\"false\" scale=\"aspect\"></div>'),$(\".fullview\").attr(\"href\",t).text(\"View\"),$(\".modal-title\").text(t),$(\"#viewer-modal\").modal(\"show\")});$(\".source-modal\").click(function(e){e.preventDefault();var t=$(this).attr(\"href\");$.ajax(t,{dataType:'text',success:function(data){\$(\".modal-body\").empty().append('<pre><code id=\"source\"></code></pre>');$(\"#source\").text(data);$(\".fullview\").attr(\"href\",t).text(\"View\"),$(\".modal-title\").text(t),$(\"#viewer-modal\").modal(\"show\")}})});$(\"#viewer-modal\").on(\"hide.bs.modal\",function(){var e=document.getElementById(\"player\");e&&e.pause()});</script>" . PHP_EOL;
}
if (ENABLE_SORT) {
    $footer = $footer."  <script type=\"text/javascript\">(function(c){c.fn.stupidtable=function(b){return this.each(function(){var a=c(this);b=b||{};b=c.extend({},c.fn.stupidtable.default_sort_fns,b);a.on(\"click.stupidtable\",\"th\",function(){var d=c(this),f=0,g=c.fn.stupidtable.dir;a.find(\"th\").slice(0,d.index()).each(function(){var a=c(this).attr(\"colspan\")||1;f+=parseInt(a,10)});var e=d.data(\"sort-default\")||g.ASC;d.data(\"sort-dir\")&&(e=d.data(\"sort-dir\")===g.ASC?g.DESC:g.ASC);var l=d.data(\"sort\")||null;null!==l&&(a.trigger(\"beforetablesort\",{column:f, direction:e}),a.css(\"display\"),setTimeout(function(){var h=[],m=b[l],k=a.children(\"tbody\").children(\"tr\");k.each(function(a,b){var d=c(b).children().eq(f),e=d.data(\"sort-value\"),d=\"undefined\"!==typeof e?e:d.text();h.push([d,b])});h.sort(function(a,b){return m(a[0],b[0])});e!=g.ASC&&h.reverse();k=c.map(h,function(a){return a[1]});a.children(\"tbody\").append(k);a.find(\"th\").data(\"sort-dir\",null).removeClass(\"sorting-desc sorting-asc\");d.data(\"sort-dir\",e).addClass(\"sorting-\"+e);a.trigger(\"aftertablesort\", {column:f,direction:e});a.css(\"display\")},10))})})};c.fn.stupidtable.dir={ASC:\"asc\",DESC:\"desc\"};c.fn.stupidtable.default_sort_fns={\"int\":function(b,a){return parseInt(b,10)-parseInt(a,10)},\"float\":function(b,a){return parseFloat(b)-parseFloat(a)},string:function(b,a){return b<a?-1:b>a?1:0},\"string-ins\":function(b,a){b=b.toLowerCase();a=a.toLowerCase();return b<a?-1:b>a?1:0}}})(jQuery);$(\"#bs-table\").stupidtable();</script>" . PHP_EOL;
}
if (ANALYTICS_ID) {
    $footer = $footer."  <script type=\"text/javascript\">var _gaq=_gaq||[];_gaq.push([\"_setAccount\",\"".ANALYTICS_ID."\"]);_gaq.push([\"_trackPageview\"]);(function(){var ga=document.createElement(\"script\");ga.type=\"text/javascript\";ga.async=true;ga.src=(\"https:\"==document.location.protocol?\"https://ssl\":\"http://www\")+\".google-analytics.com/ga.js\";var s=document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(ga,s)})();</script>" . PHP_EOL;
}
// Set breadcrumbs
$breadcrumbs = $breadcrumbs."      <li><a href=\"".$absolute_path."\">$home</a></li>" . PHP_EOL;
foreach($dir_name as $dir => $name) :
	if(($name != ' ') && ($name != '') && ($name != '.') && ($name != '/')):
		$parent = '';
		for ($i = 0; $i <= $dir; $i++):
			$parent .= rawurlencode($dir_name[$i]) . '/';
		endfor;
    	$breadcrumbs = $breadcrumbs."      <li><a href=\"".$absolute_path.$parent."\">".utf8_encode($name)."</a></li>" . PHP_EOL;
	endif;
endforeach;

// Set responsiveness
if (RESPONSIVE_TABLE) {
    $responsive_open = "    <div class=\"table-responsive\">" . PHP_EOL;
    $responsive_close = "    </div>" . PHP_EOL;
}

// Set table header
$table_header = $table_header."            <th class=\"col-lg-8 text-left\" data-sort=\"string\">Name</th>";

if ($table_options['size']) {
    $table_header = $table_header."            <th";
    if (ENABLE_SORT) {
        $table_header = $table_header." class=\"col-lg-2 text-right\" data-sort=\"int\">";
    } else {
        $table_header = $table_header.">";
    }
    $table_header = $table_header."Size</th>" . PHP_EOL;
}

if ($table_options['age']) {
    $table_header = $table_header."            <th";
    if (ENABLE_SORT) {
        $table_header = $table_header." class=\"col-lg-2 text-right\" data-sort=\"int\">";
    } else {
        $table_header = $table_header.">";
    }
    $table_header = $table_header."Modified</th>" . PHP_EOL;
}

// Set table body
if(($folder_list) || ($file_list) ) {

    if($folder_list):    
        foreach($folder_list as $item) :

            $table_body = $table_body."          <tr>" . PHP_EOL;
            $table_body = $table_body."            <td";
            if (ENABLE_SORT) {
                $table_body = $table_body." data-sort-value=\"". utf8_encode($item['lbname']) . "\"" ;
            }
            $table_body = $table_body.">";
            if (DOC_ICONS == "glyphicons" || DOC_ICONS == "fontawesome") {
                $table_body = $table_body."<$icon_tag class=\"$folder_icon\"></$icon_tag>&nbsp;";
            }
            $table_body = $table_body."<a href=\"" . rawurlencode($item['bname']) . "/\"><strong>" . utf8_encode($item['bname']) . "</strong></a></td>" . PHP_EOL;
            
            if ($table_options['size']) {
                $table_body = $table_body."            <td";
                if (ENABLE_SORT) {
                    $table_body = $table_body." class=\"text-right\" data-sort-value=\"0\"";
                }
                $table_body = $table_body.">&mdash;</td>" . PHP_EOL;
            }

            if ($table_options['age']) {
                $table_body = $table_body."            <td";
                if (ENABLE_SORT) {
                    $table_body = $table_body." class=\"text-right\" data-sort-value=\"" . $item['mtime'] . "\"";
                }
                $table_body = $table_body . ">" . time_ago($item['mtime']) . "ago</td>" . PHP_EOL;
            }

            $table_body = $table_body."          </tr>" . PHP_EOL;

        endforeach;
    endif;

    if($file_list):
        foreach($file_list as $item) :
            $table_body = $table_body."          <tr>" . PHP_EOL;
            $table_body = $table_body."            <td";
            if (ENABLE_SORT) {
                $table_body = $table_body." data-sort-value=\"". utf8_encode($item['lbname']) . "\"" ;
            }
            $table_body = $table_body.">";
            if (DOC_ICONS == "glyphicons" || DOC_ICONS == "fontawesome") {
                $table_body = $table_body."<$icon_tag class=\"" . $item['class'] . "\"></$icon_tag>&nbsp;";
            }
            if (HIDE_EXTENSION) {
                $display_name = utf8_encode($item['name']);
            } else {
                $display_name = utf8_encode($item['bname']);
            }

            // inject modal class if necessary
            if (ENABLE_VIEWER) {
                if (in_array($item['lext'], $audio_files)) {
                    $modal_class = ' class="audio-modal"';
                } else if ($item['lext'] == 'swf') {
                    $modal_class = ' class="flash-modal"';
                } else if (in_array($item['lext'], $image_files)) {
                    $modal_class = ' class="image-modal"';
                } else if (in_array($item['lext'], $quicktime_files)) {
                    $modal_class = ' class="quicktime-modal"';
                } else if (in_array($item['lext'], $source_files)) {
-                    $modal_class = ' class="source-modal"';
                } else if (in_array($item['lext'], $video_files)) {
                    $modal_class = ' class="video-modal"';
                } else {
                    $modal_class = NULL;
                }
            }
            $table_body = $table_body."<a href=\"" . rawurlencode($item['bname']) . "\"$modal_class>" . htmlspecialchars($display_name) . "</a></td>" . PHP_EOL;

            if ($table_options['size']) {
                $table_body = $table_body."            <td";
                if (ENABLE_SORT) {
                    $table_body = $table_body." class=\"text-right\" data-sort-value=\"" . $item['bytes'] . "\"";
                }
                    $table_body = $table_body.">" . $item['size']['num'] . " " . $item['size']['str'] . "</td>" . PHP_EOL;
            }

            if ($table_options['age']) {
                $table_body = $table_body."            <td";
                if (ENABLE_SORT) {
                    $table_body = $table_body." class=\"text-right\" data-sort-value=\"".$item['mtime']."\"";
                }
                $table_body = $table_body . ">" . time_ago($item['mtime']) . "ago</td>" . PHP_EOL;
            }

            $table_body = $table_body."          </tr>" . PHP_EOL;
        endforeach;
    endif;
} else {
        $colspan = $table_count + 1;
        $table_body = $table_body."          <tr>" . PHP_EOL;
        $table_body = $table_body."            <td colspan=\"$colspan\" style=\"font-style:italic\">";
        if (DOC_ICONS == "glyphicons" || DOC_ICONS == "fontawesome") {
            $table_body = $table_body."<$icon_tag class=\"" . $item['class'] . "\">&nbsp;</$icon_tag>";
        } 
        $table_body = $table_body."empty folder</td>" . PHP_EOL;
        $table_body = $table_body."          </tr>" . PHP_EOL;
}

// Give kudos
if (GIVE_KUDOS) {
    $kudos = "<a class=\"pull-right small text-muted\" href=\"https://github.com/idleberg/Bootstrap-Listr\" title=\"Bootstrap Listr on GitHub\" target=\"_blank\">Fork me on GitHub</a>";
}


/*** HTML TEMPLATE ***/
/*** HTTP Header ***/
header("Content-Type: text/html; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate");

?>
<!DOCTYPE html>
<html>
<head>
<?=$header?>
</head>
<body>
  <div class="container">
    <ol class="breadcrumb">
<?=$breadcrumbs?>
    </ol>
<?=$responsive_open?>
      <table id="bs-table" class="table <?=TABLE_STYLE?>">
        <thead>
          <tr>
<?=$table_header?>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td colspan="<?=$table_count+1?>">
              <small class="pull-left text-muted"><?=$contained?></small>
              <?=$kudos?>
            </td>
          </tr>
        </tfoot>
        <tbody>
<?=$table_body?>
        </tbody>                          
      </table>
<?=$responsive_close?>
<? if (ENABLE_VIEWER) { ?>
    <div class="modal fade" id="viewer-modal" tabindex="-1" role="dialog" aria-labelledby="file-name" aria-hidden="true">
      <div class="modal-dialog <?=MODAL_SIZE?>">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="file-name">&nbsp;</h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <a class="btn btn-primary fullview">View</a>
          </div>
        </div>
      </div>
    </div>
<? } ?>
  </div>
<?=$footer?>
</body>
</html>
