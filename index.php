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


require_once('listr-config.php');
require_once('listr-functions.php');

// Get this folder and files name.
$this_script    = basename(__FILE__);

$this_folder    = (isset($_GET['path'])) ? $_GET['path'] : "";
$this_folder    = str_replace('..', '', $this_folder);
$this_folder    = str_replace($this_script, '', $this_folder);
$this_folder    = str_replace('index.php', '', $this_folder);
$this_folder    = str_replace('//', '/', $this_folder);

$navigation_dir = FOLDER_ROOT .$this_folder;
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
        readfile($navigation_dir);     
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

if (DOC_ICONS == "glyphicons") { 
    $icon_tag = 'span';
    $home = "<span class=\"glyphicon glyphicon-home\"></span>";
} else if (DOC_ICONS == "fontawesome") { 
    $icon_tag = 'i';
    $home = "<i class=\"fa fa-home fa-lg fa-fw\"></i> ";
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
        'flash'     => array('fla','flv','swf'),
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
} else {
    $home = $this_domain;
}  

if (ENABLE_VIEWER) {
    $audio_files     = array('m4a','mp3','oga','ogg','webma','wav');
    $image_files     = array('gif','ico','jpe','jpeg','jpg','png','svg','webp');
    $quicktime_files = array('3g2','3gp','3gp2','3gpp','mov','qt');
    $source_files    = array('atom','bat','cmd','css','hml','jade','js','json','less','markdown','md','pl','py','rb','rss','rst','sass','scpt','scss','sh','txt','xml','yml');
    $video_files     = array('mp4','m4v','ogv','webm');
}

$bootstrap_cdn = set_bootstrap_theme();

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
                }elseif(in_array($item['lext'], $filetype['flash'])){
                    $item['class'] = 'fa fa-bolt ' . FONTAWESOME_STYLE;
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
                $stat               =   stat($navigation_dir.$file); // ... slow, but faster than using filemtime() & filesize() instead.

            if ($table_options['size']) {
                $item['bytes']      =   $stat['size'];
                $item['size']       =   bytes_to_string($stat['size'], 2);
            }

            if ($table_options['age']) {
                $item['mtime']      =   $stat['mtime'];
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

$header = set_header($bootstrap_cdn);
$footer = set_footer();

// Set breadcrumbs
$breadcrumbs = $breadcrumbs."    <ol class=\"breadcrumb\">" . PHP_EOL;
$breadcrumbs = $breadcrumbs."      <li><a href=\"".htmlentities($root_dir, ENT_QUOTES, 'utf-8')."\">$home</a></li>" . PHP_EOL;
foreach($dir_name as $dir => $name) :
    if(($name != ' ') && ($name != '') && ($name != '.') && ($name != '/')):
        $parent = '';
        for ($i = 0; $i <= $dir; $i++):
            $parent .= rawurlencode($dir_name[$i]) . '/';
        endfor;
        $breadcrumbs = $breadcrumbs."      <li><a href=\"".htmlentities($absolute_path.$parent, ENT_QUOTES, 'utf-8')."\">".utf8_encode($name)."</a></li>" . PHP_EOL;
    endif;
endforeach;
$breadcrumbs = $breadcrumbs."    </ol>" . PHP_EOL;

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
                $table_body = $table_body." data-sort-value=\"". htmlentities(utf8_encode($item['lbname']), ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body = $table_body.">";
            if (DOC_ICONS == "glyphicons" || DOC_ICONS == "fontawesome") {
                $table_body = $table_body."<$icon_tag class=\"$folder_icon\"></$icon_tag>&nbsp;";
            }
            $table_body = $table_body."<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "/\"><strong>" . utf8_encode($item['bname']) . "</strong></a></td>" . PHP_EOL;
            
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
                $table_body = $table_body." data-sort-value=\"". htmlentities(utf8_encode($item['lbname']), ENT_QUOTES, 'utf-8') . "\"" ;
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
            $table_body = $table_body."<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "\"$modal_class>" . htmlspecialchars($display_name) . "</a></td>" . PHP_EOL;

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
<?=$breadcrumbs?>
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
<? if ((HIGHLIGHTER_JS) && (HIGHLIGHTER_CSS)) { ?>
            <button type="button" class="pull-left btn btn-link highlight hidden">Apply code highlighting</button>
<? } ?>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
<? if (SHARE_BUTTON) { ?>
            <div class="btn-group">
              <a class="btn btn-primary fullview"></a>
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu" role="menu">
<? if (DROPBOX_KEY) { ?>
                <li><a class="save-dropbox">Save to Dropbox</a></li>
                <li class="divider"></li>
<? } ?>
                <li><a class="email-link">Email</a></li>
                <li><a class="facebook-link">Facebook</a></li>
                <li><a class="google-link">Google+</a></li>
                <li><a class="twitter-link">Twitter</a></li>
              </ul>
            </div>
<? } else { ?>
            <a class="btn btn-primary fullview"></a>
<? } ?>
          </div>
        </div>
      </div>
    </div>
<? } ?>
  </div>
<?=$footer?>
</body>
</html>
