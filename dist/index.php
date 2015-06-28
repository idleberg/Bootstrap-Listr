<?php

error_reporting(E_ERROR);

/**
 *      Bootstrap Listr
 *
 *       Author:    Jan T. Sott
 *         Info:    http://github.com/idleberg/Bootstrap-Listr
 *      License:    The MIT License (MIT)
 *
 *      Credits:    Greg Johnson - PHPDL lite (http://greg-j.com/phpdl/)
 *                  Na Wong - Listr (http://nadesign.net/listr/)
 *                  Joe McCullough - Stupid Table Plugin (http://joequery.github.io/Stupid-Table-Plugin/)
 */

// require_once('listr-config.php');
$file    = "config.json";
$options = json_decode(file_get_contents($file), true);

if($options['general']['locale'] != null ) {
    require_once('listr-l10n.php');
}
require_once('listr-functions.php');

// Configure optional table columns
$table_options = $options['columns'];

// Set sorting properties.
$sort = array(
    array('key'=>'lname', 'sort'=>'asc'), // ... this sets the initial sort "column" and order ...
    array('key'=>'size',  'sort'=>'asc') // ... for items with the same initial sort value, sort this way.
);

// Files you want to hide from the listing
$ignore_list = $options['ignored_files'];

// Get this folder and files name.
$this_script    = basename(__FILE__);

$this_folder    = (isset($_GET['path'])) ? $_GET['path'] : "";
$this_folder    = str_replace('..', '', $this_folder);
$this_folder    = str_replace($this_script, '', $this_folder);
$this_folder    = str_replace('index.php', '', $this_folder);
$this_folder    = str_replace('//', '/', $this_folder);

$navigation_dir = $options['general']['root_dir'] .$this_folder;
$root_dir       = dirname($_SERVER['PHP_SELF']);

$absolute_path  = str_replace(str_replace("%2F", "/", rawurlencode($this_folder)), '', $_SERVER['REQUEST_URI']);
$dir_name       = explode("/", $this_folder);

if(substr($navigation_dir, -1) != "/"){
    if(file_exists($navigation_dir)){

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
        header('Accept-Ranges: bytes');
        header('Pragma: public');
        header('Content-Length: ' . filesize($navigation_dir));
        ob_clean();
        flush();
        if ($options['general']['read_chunks'] == true) { 
            readfile_chunked($navigation_dir);
        } else {
            readfile($navigation_dir);     
        }  
    } else {
        set_404_error();
    }
    exit;
} else {
    if(!file_exists($navigation_dir)){
        set_404_error();
        exit;  
    }
}

// Declare vars used beyond this point.
$file_list = array();
$folder_list = array();
$total_size = 0;

if ($options['bootstrap']['icons'] == "glyphicons") { 
    $icons['tag'] = 'span';
    $icons['home'] = "<span class=\"glyphicon glyphicon-home\"></span>";
    if ($options['general']['enable_search'] == true) {
        $icons['search'] = "          <span class=\"glyphicon glyphicon-search form-control-feedback\"></span>" . PHP_EOL;
    }
} else if (($options['bootstrap']['icons'] == "fontawesome") || ($options['bootstrap']['icons'] == 'fa-files')) { 
    $icons['tag']   = 'i';
    $icons['home']  = "<i class=\"fa fa-home fa-lg fa-fw\"></i> ";
    if ($options['general']['share_icons'] == true) { 
        $icons_dropbox  = "<i class=\"fa fa-dropbox fa-fw\"></i> ";
        $icons_email    = "<i class=\"fa fa-envelope fa-fw\"></i> ";
        $icons_facebook = "<i class=\"fa fa-facebook fa-fw\"></i> ";
        $icons_gplus    = "<i class=\"fa fa-google-plus fa-fw\"></i> ";
        $icons_twitter  = "<i class=\"fa fa-twitter fa-fw\"></i> ";
    }
    if ($options['general']['enable_search'] == true) {
        $icons['search'] = "          <i class=\"fa fa-search form-control-feedback\"></i>" . PHP_EOL;
    }

    if ($options['bootstrap']['icons'] == "fontawesome") {
        $filetype = array(
            'archive'   => array('7z','ace','adf','air','apk','arj','bz2','bzip','cab','d64','dmg','git','hdf','ipf','iso','fdi','gz','jar','lha','lzh','lz','lzma','pak','phar','pkg','pimp','rar','safariextz','sfx','sit','sitx','sqx','sublime-package','swm','tar','tgz','wim','wsz','xar','zip'),
            'apple'     => array('app','ipa','ipsw','saver'),
            'audio'     => array('aac','ac3','aif','aiff','au','caf','flac','it','m4a','m4p','med','mid','mo3','mod','mp1','mp2','mp3','mpc','ned','ra','ram','oga','ogg','oma','opus','s3m','sid','umx','wav','webma','wv','xm'),
            'calendar'  => array('icbu','ics'),
            'config'    => array('cfg','conf','ini','htaccess','htpasswd','plist','sublime-settings','xpy'),
            'contact'   => array('abbu','contact','oab','pab','vcard','vcf'),
            'database'  => array('bde','crp','db','db2','db3','dbb','dbf','dbk','dbs','dbx','edb','fdb','frm','fw','fw2','fw3','gdb','itdb','mdb','ndb','nsf','rdb','sas7mdb','sql','sqlite','tdb','wdb'),
            'doc'       => array('abw','doc','docm','docs','docx','dot','key','numbers','odb','odf','odg','odp','odt','ods','otg','otp','ots','ott','pages','pdf','pot','ppt','pptx','sdb','sdc','sdd','sdw','sxi','wp','wp4','wp5','wp6','wp7','wpd','xls','xlsx','xps'),
            'downloads' => array('!bt','!qb','!ut','crdownload','download','opdownload','part'),
            'ebook'     => array('aeh','azw','ceb','chm','epub','fb2','ibooks','kf8','lit','lrf','lrx','mobi','pdb','pdg','prc','xeb'),
            'email'     => array('eml','emlx','mbox','msg','pst'),
            'feed'      => array('atom','rss'),
            'flash'     => array('fla','flv','swf'),
            'font'      => array('eot','fon','otf','pfm','ttf','woff'),
            'image'     => array('ai','bmp','cdr','emf','eps','gif','icns','ico','jp2','jpe','jpeg','jpg','jpx','pcx','pict','png','psd','psp','svg','tga','tif','tiff','webp','wmf'),
            'link'      => array('lnk','url','webloc'),
            'linux'     => array('bin','deb','rpm'),
            'palette'   => array('ase','clm','clr','gpl'),
            'raw'       => array('3fr','ari','arw','bay','cap','cr2','crw','dcs','dcr','dnf','dng','eip','erf','fff','iiq','k25','kdc','mdc','mef','mof','mrw','nef','nrw','obm','orf','pef','ptx','pxn','r3d','raf','raw','rwl','rw2','rwz','sr2','srf','srw','x3f'),
            'script'    => array('ahk','as','asp','aspx','bat','c','cfm','clj','cmd','cpp','css','el','erb','g','hml','java','js','json','jsp','less','nsh','nsi','php','php3','pl','py','rb','rhtml','sass','scala','scm','scpt','scptd','scss','sh','shtml','wsh','xml','yml'),
            'text'      => array('ans','asc','ascii','csv','diz','latex','log','markdown','md','nfo','rst','rtf','tex','text','txt'),
            'video'     => array('3g2','3gp','3gp2','3gpp','asf','avi','bik','bup','divx','ifo','m4v','mkv','mkv','mov','mp4','mpeg','mpg','rm','rv','ogv','qt','smk','vob','webm','wmv','xvid'),
            'website'   => array('htm','html','mhtml','mht','xht','xhtml'),
            'windows'   => array('dll','exe','msi','pif','ps1','scr','sys')
        );
    } else if ($options['bootstrap']['icons'] == 'fa-files') {
        $filetype = array(
            'archive'    => array('7z','ace','adf','air','apk','arj','bz2','bzip','cab','d64','dmg','git','hdf','ipf','iso','fdi','gz','jar','lha','lzh','lz','lzma','pak','phar','pkg','pimp','rar','safariextz','sfx','sit','sitx','sqx','sublime-package','swm','tar','tgz','wim','wsz','xar','zip'),
            'audio'      => array('aac','ac3','aif','aiff','au','caf','flac','it','m4a','m4p','med','mid','mo3','mod','mp1','mp2','mp3','mpc','ned','ra','ram','oga','ogg','oma','s3m','sid','umx','wav','webma','wv','xm'),
            'excel'      => array('xls','xlsx','numbers'),
            'image'      => array('ai','bmp','cdr','emf','eps','gif','icns','ico','jp2','jpe','jpeg','jpg','jpx','pcx','pict','png','psd','psp','svg','tga','tif','tiff','webp','wmf'),
            'pdf'        => array('pdf'),
            'powerpoint' => array('pot','ppt','pptx','key'),
            'script'     => array('ahk','as','asp','aspx','bat','c','cfm','clj','cmd','cpp','css','el','erb','g','hml','java','js','json','jsp','less','nsh','nsi','php','php3','pl','py','rb','rhtml','sass','scala','scm','scpt','scptd','scss','sh','shtml','wsh','xml','yml'),
            'text'       => array('ans','asc','ascii','csv','diz','latex','log','markdown','md','nfo','rst','rtf','tex','text','txt'),
            'video'      => array('3g2','3gp','3gp2','3gpp','asf','avi','bik','bup','divx','flv','ifo','m4v','mkv','mkv','mov','mp4','mpeg','mpg','rm','rv','ogv','qt','smk','swf','vob','webm','wmv','xvid'),
            'word'       => array('doc','docm','docs','docx','dot','pages'),
        );
    }
} else {
    $icons['tag']  = 'span';
    $icons['home'] = $_SERVER['HTTP_HOST'];
    $icons['search'] = null;
}  

if ($options['general']['enable_viewer']) {
    $audio_files     = explode(',', $options['viewer']['audio']);
    $image_files     = explode(',', $options['viewer']['image']);
    $quicktime_files = explode(',', $options['viewer']['quicktime']);
    $source_files    = explode(',', $options['viewer']['source']);
    $text_files      = explode(',', $options['viewer']['text']);
    $video_files     = explode(',', $options['viewer']['video']);
    $website_files   = explode(',', $options['viewer']['website']);
}

if ($options['general']['text_direction'] == 'rtl') {
    $direction     = " dir=\"rtl\"";
    $right         = "left";
    $left          = "right";
    $search_offset = null;
} else {
    $direction     = " dir=\"ltr\"";
    $right         = "right";
    $left          = "left";
    $search_offset = " col-xs-offset-6 col-sm-offset-9";
}

$bootstrap_cdn = set_bootstrap_theme();

// Set Bootstrap defaults
if (isset($options['bootstrap']['modal_size'])) {
    $modal_size = $options['bootstrap']['modal_size'];
} else {
    $modal_size = 'modal-lg';
}

if (isset($options['bootstrap']['button_default'])) {
    $btn_default = $options['bootstrap']['button_default'];
} else {
    $btn_default = 'btn-default';
}

if (isset($options['bootstrap']['button_primary'])) {
    $btn_primary = $options['bootstrap']['button_primary'];
} else {
    $btn_primary = 'btn-primary';
}

if (isset($options['bootstrap']['button_highlight'])) {
    $btn_highlight = $options['bootstrap']['button_highlight'];
} else {
    $btn_highlight = 'btn-link';
}

if (isset($options['bootstrap']['column_name'])) {
    $column_name = $options['bootstrap']['column_name'];
} else {
    $column_name = 'col-lg-8';
}

if (isset($options['bootstrap']['column_size'])) {
    $column_size = $options['bootstrap']['column_size'];
} else {
    $column_size = 'col-lg-2';
}

if (isset($options['bootstrap']['column_age'])) {
    $column_age = $options['bootstrap']['column_age'];
} else {
    $column_age = 'col-lg-2';
}

if ($options['bootstrap']['breadcrumb_style'] != "") {
    $breadcrumb_style = " ".$options['bootstrap']['breadcrumb_style'];
} else {
    $breadcrumb_style = null;
}

if ($options['bootstrap']['fluid_grid'] == true) {
    $container = "container-fluid";
} else {
    $container = "container";
}

// Set responsiveness
if ($options['bootstrap']['responsive_table']) {
    $responsive_open = "    <div class=\"table-responsive\">" . PHP_EOL;
    $responsive_close = "    </div>" . PHP_EOL;
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
        if ($file != "." && $file != ".." && $file != $this_script && !in_array($file, $ignore_list) )
        {
            if ( ($options['general']['hide_dotfiles'] == true) && (substr($file, 0, 1) == '.') ) {
                continue;
            }

            // Get file info.
            $info                  =    pathinfo($file);
            // Organize file info.
            $item['name']          =     $info['filename'];
            $item['lname']         =     strtolower($info['filename']);
            $item['bname']         =     $info['basename'];
            $item['lbname']        =     strtolower($info['basename']);

            if (isset($info['extension'])) {
                $item['ext'] = $info['extension'];
            } else {
                $item['ext'] = '.';
            }
            $item['lext'] = strtolower($info['extension']);

            if ($options['bootstrap']['icons'] == 'fontawesome') {
                $folder_icon = 'fa fa-folder ' . $options['bootstrap']['fontawesome_style'];
                if(in_array($item['lext'], $filetype['archive'])){
                    $item['class'] = 'fa fa-archive ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['apple'])){
                    $item['class'] = 'fa fa-apple ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['audio'])){
                    $item['class'] = 'fa fa-music ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['calendar'])){
                    $item['class'] = 'fa fa-calendar ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['config'])){
                    $item['class'] = 'fa fa-cogs ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['contact'])){
                    $item['class'] = 'fa fa-group ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['database'])){
                    $item['class'] = 'fa fa-database ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['doc'])){
                    $item['class'] = 'fa fa-file-text ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['downloads'])){
                    $item['class'] = 'fa fa-cloud-download ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['ebook'])){
                    $item['class'] = 'fa fa-book ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['email'])){
                    $item['class'] = 'fa fa-envelope ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['feed'])){
                    $item['class'] = 'fa fa-rss ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['flash'])){
                    $item['class'] = 'fa fa-bolt ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['font'])){
                    $item['class'] = 'fa fa-font ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['image'])){
                    $item['class'] = 'fa fa-picture-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['link'])){
                    $item['class'] = 'fa fa-link ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['linux'])){
                    $item['class'] = 'fa fa-linux ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['palette'])){
                    $item['class'] = 'fa fa-tasks ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['raw'])){
                    $item['class'] = 'fa fa-camera ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['script'])){
                    $item['class'] = 'fa fa-code ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['text'])){
                    $item['class'] = 'fa fa-file-text-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['video'])){
                    $item['class'] = 'fa fa-film ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['website'])){
                    $item['class'] = 'fa fa-globe ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['windows'])){
                    $item['class'] = 'fa fa-windows ' . $options['bootstrap']['fontawesome_style'];
                }else{
                    $item['class'] = 'fa fa-file-o ' . $options['bootstrap']['fontawesome_style'];        
                }
            } else if ($options['bootstrap']['icons'] == 'fa-files') {
                $folder_icon = 'fa fa-folder ' . $options['bootstrap']['fontawesome_style'];
                if(in_array($item['lext'], $filetype['archive'])){
                    $item['class'] = 'fa fa-file-archive-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['audio'])){
                    $item['class'] = 'fa fa-file-audio-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['excel'])){
                    $item['class'] = 'fa fa-file-excel-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['image'])){
                    $item['class'] = 'fa fa-file-image-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['pdf'])){
                    $item['class'] = 'fa fa-file-pdf-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['powerpoint'])){
                    $item['class'] = 'fa fa-file-powerpoint-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['script'])){
                    $item['class'] = 'fa fa-file-code-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['text'])){
                    $item['class'] = 'fa fa-file-text-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['video'])){
                    $item['class'] = 'fa fa-file-video-o ' . $options['bootstrap']['fontawesome_style'];
                }elseif(in_array($item['lext'], $filetype['word'])){
                    $item['class'] = 'fa fa-file-word-o ' . $options['bootstrap']['fontawesome_style'];
                }else{
                    $item['class'] = 'fa fa-file-o ' . $options['bootstrap']['fontawesome_style'];        
                }
            } else {
                $folder_icon   = 'glyphicon glyphicon-folder-close';
                $item['class'] = 'glyphicon glyphicon-file';
            }

            if ($table_options['size'] || $table_options['age'])
                $stat               =   stat($navigation_dir.$file); // ... slow, but faster than using filemtime() & filesize() instead.

            if ($table_options['size']) {
                $item['bytes']      =   $stat['size'];
                $item['size']       =   bytes_to_string($stat['size'], 2);
            }

            if ($table_options['age']) {
                $item['mtime']      =   $stat['mtime'];
                $item['iso_mtime']  =   gmdate("Y-m-d H:i:s", $item['mtime']);
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
        } else if ($file == ".listr") {
            $loptions    = json_decode(file_get_contents($navigation_dir.$file), true);
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
// Calculate the total folder size (fix: total size cannot display while there is no folder inside the directory)
if($file_list && $folder_list || $file_list)
    $total_size = bytes_to_string($total_size, 2);

$total_folders = count($folder_list);
$total_files = count($file_list);

// Localized summary, hopefully not overly complicated
if ( ($total_folders == 1) && ($total_files == 0) ) {
    $summary = sprintf(_('%1$s folder'), $total_folders);
} else if ( ($total_folders > 1) && ($total_files == 0) ) {
    $summary = sprintf(_('%1$s folders'), $total_folders);
} else if ( ($total_folders == 0) && ($total_files == 1) ) {
    $summary = sprintf(_('%1$s file, %2$s %3$s in total'), $total_files, $total_size['num'], $total_size['str']);
} else if ( ($total_folders == 0) && ($total_files > 1) ) {
    $summary = sprintf(_('%1$s files, %2$s %3$s in total'), $total_files, $total_size['num'], $total_size['str']);
} else if ( ($total_folders == 1) && ($total_files == 1) ) {
    $summary = sprintf(_('%1$s folder and %2$s file, %3$s %4$s in total'), $total_folders, $total_files, $total_size['num'], $total_size['str']);
} else if ( ($total_folders == 1) && ($total_files >1) ) {
    $summary = sprintf(_('%1$s folder and %2$s files, %3$s %4$s in total'), $total_folders, $total_files, $total_size['num'], $total_size['str']);
} else if ( ($total_folders > 1) && ($total_files == 1) ) {
    $summary = sprintf(_('%1$s folders and %2$s file, %3$s %4$s in total'), $total_folders, $total_files, $total_size['num'], $total_size['str']);
} else if ( ($total_folders > 1) && ($total_files > 1) ) {
    $summary = sprintf(_('%1$s folders and %2$s files, %3$s %4$s in total'), $total_folders, $total_files, $total_size['num'], $total_size['str']);
}

// Merge local settings with global settings
if(isset($loptions)) {
    $options = array_merge($options, $loptions);
}

$header = set_header($bootstrap_cdn);
$footer = set_footer();

// Set breadcrumbs
$breadcrumbs  = "    <ol class=\"breadcrumb$breadcrumb_style\"".$direction.">" . PHP_EOL;
$breadcrumbs .= "      <li><a href=\"".htmlentities($root_dir, ENT_QUOTES, 'utf-8')."\">".$icons['home']."</a></li>" . PHP_EOL;
foreach($dir_name as $dir => $name) :
    if(($name != ' ') && ($name != '') && ($name != '.') && ($name != '/')):
        $parent = '';
        for ($i = 0; $i <= $dir; $i++):
            $parent .= rawurlencode($dir_name[$i]) . '/';
        endfor;
        $breadcrumbs .= "      <li><a href=\"".htmlentities($absolute_path.$parent, ENT_QUOTES, 'utf-8')."\">".$name."</a></li>" . PHP_EOL;
    endif;
endforeach;
$breadcrumbs = $breadcrumbs."    </ol>" . PHP_EOL;

// Show search
if ($options['general']['enable_search'] == true) {

    $autofocus = null;
    if ($options['general']['autofocus_search'] == true) {
        $autofocus = " autofocus";
    }

    if ($options['bootstrap']['input_size'] != "") {
        $input_size = " ".$options['bootstrap']['input_size'];
    } else {
        $input_size = null;
    }

    $search  = "    <div class=\"row\">" . PHP_EOL;
    $search .= "      <div class=\"col-xs-6 col-sm-3$search_offset\">" . PHP_EOL;
    $search .= "        <div class=\"form-group has-feedback\">" . PHP_EOL;
    $search .= "          <label class=\"control-label sr-only\" for=\"search\">". _('Search')."</label>" . PHP_EOL;
    $search .= "          <input type=\"text\" class=\"form-control$input_size\" id=\"search\" placeholder=\"". _('Search')."\"$autofocus>" . PHP_EOL;
    $search .= $icons['search'];
    $search .= "       </div>" . PHP_EOL;
    $search .= "      </div>" . PHP_EOL;
    $search .= "    </div>" . PHP_EOL;
}

// Set table header
$table_header = null;
$table_header .= "            <th class=\"".$column_name." text-".$left."\" data-sort=\"string\">"._('Name')."</th>" . PHP_EOL;

if ($table_options['size']) {
    $table_header .= "            <th";
    if ($options['general']['enable_sort']) {
        $table_header .= " class=\"".$column_size." text-".$right."\" data-sort=\"int\">";
    } else {
        $table_header .= ">";
    }
    $table_header .= _('Size')."</th>" . PHP_EOL;
}

if ($table_options['age']) {
    $table_header .= "            <th";
    if ($options['general']['enable_sort']) {
        $table_header .= " class=\"".$column_age." text-".$right."\" data-sort=\"int\">";
    } else {
        $table_header .= ">";
    }
    $table_header .= _('Modified')."</th>" . PHP_EOL;
}

// Set table body
$table_body = null;
if(($folder_list) || ($file_list) ) {

    if($folder_list):    
        foreach($folder_list as $item) :

            if ($options['bootstrap']['tablerow_folders'] != "") {
                $tr_folders = " class=\"".$options['bootstrap']['tablerow_folders']."\"";
            } else {
                $tr_folders = null;
            }

            $table_body .= "          <tr$tr_folders>" . PHP_EOL;
            $table_body .= "            <td";
            if ($options['general']['enable_sort']) {
                $table_body .= " class=\"text-".$left."\" data-sort-value=\"". htmlentities(utf8_encode($item['lbname']), ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body .= ">";
            if ($options['bootstrap']['icons'] == "glyphicons" || $options['bootstrap']['icons'] == "fontawesome" || $options['bootstrap']['icons'] == "fa-files" ) {
                $table_body .= "<".$icons['tag']." class=\"$folder_icon\"></".$icons['tag'].">&nbsp;";
            }

            $table_body .= "<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "/\"><strong>" . utf8ify($item['bname']) . "</strong></a></td>" . PHP_EOL;
            
            if ($table_options['size']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-".$right."\" data-sort-value=\"0\"";
                }
                $table_body .= ">&mdash;</td>" . PHP_EOL;
            }

            if ($table_options['age']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-".$right."\" data-sort-value=\"" . $item['mtime'] . "\"";
                    $table_body .= " title=\"" . $item['iso_mtime'] . "\"";
                }
                $table_body .= ">" . time_ago($item['mtime']) . "</td>" . PHP_EOL;
            }

            $table_body .= "          </tr>" . PHP_EOL;

        endforeach;
    endif;

    if($file_list):
        foreach($file_list as $item) :

            $row_classes  = array();
            $file_classes = array();
            $file_meta = array();

            // Style table rows
            if ($options['bootstrap']['tablerow_files'] != "") {
                $row_classes[] = $options['bootstrap']['tablerow_files'];
            }

            // Is file hidden?
            if (in_array($item['bname'], $options['hidden_files'])) {
                $row_classes[] = "hidden";
                // muted class on row…
                $row_classes[] = $options['bootstrap']['hidden_files_row'];
                // …and again for the link
                $file_classes[] = $options['bootstrap']['hidden_files_link'];
            }

            // Concatenate tr-classes
            if (!empty($row_classes)) {
                $row_attr = ' class="'.implode(" ", $row_classes).'"';
            } else {
                $row_attr = null;
            }

            $table_body .= "          <tr$row_attr>" . PHP_EOL;
            $table_body .= "            <td";
            if ($options['general']['enable_sort']) {
                $table_body .= " class=\"text-".$left."\" data-sort-value=\"". htmlentities(utf8_encode($item['lbname']), ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body .= ">";
            if ($options['bootstrap']['icons'] == "glyphicons" || $options['bootstrap']['icons'] == "fontawesome" || $options['bootstrap']['icons'] == "fa-files") {
                $table_body .= "<".$icons['tag']." class=\"" . $item['class'] . "\"></".$icons['tag'].">&nbsp;";
            }
            if ($options['general']['hide_extension']) {
                $display_name = $item['name'];
            } else {
                $display_name = $item['bname'];
            }

            $item_pretty_size = $item['size']['num'] . " " . $item['size']['str'];

            // inject modal class if necessary
            if ($options['general']['enable_viewer']) {
                if (in_array($item['lext'], $audio_files)) {
                    $file_classes[] = 'audio-modal';
                } else if ($item['lext'] == 'swf') {
                    $file_classes[] = 'flash-modal';
                } else if (in_array($item['lext'], $image_files)) {
                    $file_classes[] = 'image-modal';
                } else if (in_array($item['lext'], $quicktime_files)) {
                     $file_classes[] = 'quicktime-modal';
                } else if (in_array($item['lext'], $source_files)) {
                    if ($options['general']['auto_highlight']) {
                        $file_meta[] = 'data-highlight="true"';
                    }
                    if ($options['viewer']['alt_load'] == true) {
                        $file_classes[] = 'source-modal-alt';
                    } else {
                        $file_classes[] = 'source-modal';
                    }
                } else if (in_array($item['lext'], $text_files)) {
                    if ($options['viewer']['alt_load'] == true) {
                        $file_classes[] = 'text-modal-alt';
                    } else {
                        $file_classes[] = 'text-modal';
                    }
                } else if (in_array($item['lext'], $video_files)) {
                    $file_classes[] = 'video-modal';
                } else if (in_array($item['lext'], $website_files)) {
                    $file_classes[] = 'website-modal';
                }
            }

            $file_data = ' '.implode(" ", $file_meta);

            if ($file_classes != null) {
                $file_attr = ' class="'.implode(" ", $file_classes).'"';
            } else {
                $file_attr = null;
            }

                        $table_body .= "<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "\"$file_attr$file_data data-modified=\"".$item_pretty_size."\">" . utf8ify($display_name) . "</a></td>" . PHP_EOL;

            // Size
            if ($table_options['size']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-".$right."\" data-sort-value=\"" . $item['bytes'] . "\"";
                    $table_body .= " title=\"" . $item['bytes'] . " " ._('bytes')."\"";
                }
                    $table_body .= ">" . $item_pretty_size . "</td>" . PHP_EOL;
            }

            // Modified
            if ($table_options['age']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-".$right."\" data-sort-value=\"".$item['mtime']."\"";
                    $table_body .= " title=\"" . $item['iso_mtime'] . "\"";
                }
                $table_body .= ">" . time_ago($item['mtime']) . "</td>" . PHP_EOL;
            }

            $table_body .= "          </tr>" . PHP_EOL;
        endforeach;
    endif;
} else {
        $colspan = $table_count + 1;
        $table_body .= "          <tr>" . PHP_EOL;
        $table_body .= "            <td colspan=\"$colspan\" style=\"font-style:italic\">";
        if ($options['bootstrap']['icons'] == "glyphicons" || $options['bootstrap']['icons'] == "fontawesome" || $options['bootstrap']['icons'] == "fa-files" ) {
            $table_body .= "<".$icons['tag']." class=\"" . $item['class'] . "\">&nbsp;</".$icons['tag'].">";
        } 
        $table_body .= _("empty folder")."</td>" . PHP_EOL;
        $table_body .= "          </tr>" . PHP_EOL;
}

// Give kudos
if ($options['general']['give_kudos']) {
    $kudos = "<a class=\"pull-".$right." small text-muted\" href=\"https://github.com/idleberg/Bootstrap-Listr\" title=\"Bootstrap Listr on GitHub\" target=\"_blank\">"._('Fork me on GitHub')."</a>" . PHP_EOL;
}

require_once('listr-template.php');
?>