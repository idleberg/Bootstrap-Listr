<?php

error_reporting(1);

/**
 *      Bootstrap Listr
 *
 *       Author:    Jan T. Sott
 *         Info:    http://github.com/idleberg/Bootstrap-Listr
 *      License:    Creative Commons 3.0 Attribution-ShareAlike 3.0
 *
 *      Credits:    Greg Johnson - PHPDL lite (http://greg-j.com/phpdl/)
 *                  Na Wong - Listr (http://nadesign.net/listr/)
 *                  Joe McCullough - Stupid Table Plugin (http://joequery.github.io/Stupid-Table-Plugin/)
 */


/*** SETTINGS ***/

// Use 'table-striped' to add zebra-striping 
// Add 'table-bordered' for borders on all sides of the table and cells
// Add 'table-hover' to enable a hover state on table rows
// Add 'table-condensed' to make tables more compact by cutting cell padding in half
// Create responsive tables by wrapping any table in 'table-responsive'
define(TABLE_STYLE, 'table-hover');

// Toggle column sorting
define(ENABLE_SORT, true);

// Enable glyphicons
define(ENABLE_ICONS, true);

// Enable Font Awesome icon types, requires ENABLE_ICONS to be enabled
define(ENABLE_AWESOME, false);

// Set default viewport scaling
define(ENABLE_VIEWPORT, false);

// Stylesheet locations
define(BOOTSTRAP_THEME, 'default'); // Use Bootswatch theme names -> http://bootswatch.com/
define(FONT_AWESOME, '//netdna.bootstrapcdn.com/font-awesome/4.0.1/css/font-awesome.min.css');

// JavaScript locations
define(JQUERY, '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
define(STUPID_TABLE, '//idleberg.github.io/Bootstrap-Listr/javascripts/stupidtable.min.js');

// Icons
define(FAV_ICON, '');
define(IPHONE_ICON, ''); // 57x57
define(IPHONE_ICON_RETINA, ''); // 114x114
define(IPAD_ICON, ''); // 72x72
define(IPAD_ICON_RETINA, ''); // 144x144

// Google Analytics ID
define(ANALYTICS_ID, ''); // UA-XXXXX-Y or UA-XXXXX-YY

// Configure optional columns
$table_options = array (
	'size'=>true,
	'age'=>true,
	'perms'=>false
);

// Set sorting properties.
$sort = array(
	array('key'=>'lname',	'sort'=>'asc'), // ... this sets the initial sort "column" and order ...
	array('key'=>'size',	'sort'=>'asc') // ... for items with the same initial sort value, sort this way.
);
// Files you want to hide form the listing
$ignore_list = array(
	'.DAV',
	'.DS_Store',
	'.bzr',
	'.bzrignore',
	'.bzrtags',
	'.git',
	'.gitignore',
	'.hg',
	'.hgignore',
	'.hgtags',
	'.htaccess',
	'.npmignore',
	'.npmignore',
	'.Spotlight-V100',
	'__MACOSX',
	'ehthumbs.db',
	'robots.txt',
	'Thumbs.db'
);


/*** DIRECTORY LOGIC ***/

// Get this folder and files name.

$this_script = basename(__FILE__);
$this_folder = str_replace('/'.$this_script, '', $_SERVER['SCRIPT_NAME']);

$this_domain = $_SERVER['SERVER_NAME'];
$dir_name = explode("/", $this_folder);
//$dir_name = explode("/",dirname($_SERVER['REQUEST_URI']))
//$dir_path = explode("/", $this_folder);


	
// Declare vars used beyond this point.

$file_list = array();
$folder_list = array();
$total_size = 0;

if (ENABLE_ICONS && ENABLE_AWESOME) {
	$filetype = array(
		'archive'	=> array('7z','ace','adf','air','apk','arj','bz2','bzip','cab','d64','dmg','git','iso','gz','jar','lha','lzh','lz','lzma','pak','pkg','pimp','rar','safariextz','sfx','sit','sitx','sqx','sublime-package','tar','tgz','wsz','xar','zip'),
		'apple'		=> array('app','ipa','ipsw','saver'),
		'audio'		=> array('aac','ac3','aif','aiff','au','flac','m4a','m4p','mid','mp2','mp3','mpc','ogg','oma','sid','wav','wv'),
		'calendar'	=> array('icbu','ics'),
		'config'	=> array('conf','ini','htaccess','htpasswd','plist','sublime-settings','xpy'),
		'contact'	=> array('abbu','oab','pab','vcard','vcf'),
		'doc' 		=> array('doc','docs','docx','dot','key','numbers','odb','odf','odg','odp','ods','otg','otp','ots','ott','pages','pdf','pot','ppt','pptx','sdb','sdc','sdd','sdw','sxi','wpd','xls','xlsx','xps'),
		'downloads'	=> array('crdownload','part'),
		'ebook'		=> array('aeh','azw','ceb','chm','epub','fb2','ibooks','kf8','lit','lrf','lrx','mobi','pdb','pdg','prc','xeb'),
		'email'		=> array('eml','emlx','mbox','msg','pst'),
		'font'		=> array('fon','otf','pfm','ttf','woff'),
		'image'		=> array('ai','bmp','cdr','emf','eps','gif','icns','ico','jp2','jpe','jpeg','jpg','jpx','pcx','pict','png','psd','psp','svg','tga','tif','tiff','webp','wmf'),
		'link' 		=> array('lnk','url','webloc'),
		'linux' 	=> array('bin','deb','rpm'),
		'palette' 	=> array('ase','clm','clr','gpl'),
		'raw' 		=> array('3fr','ari','arw','bay','cap','cr2','crw','dcs','dcr','dnf','dng','eip','erf','fff','iiq','k25','kdc','mdc','mef','mof','mrw','nef','nrw','obm','orf','pef','ptx','pxn','r3d','raf','raw','rwl','rw2','rwz','sr2','srf','srw','x3f'),
		'script'	=> array('ahk','as','asp','aspx','bat','c','cfm','clj','cmd','cpp','css','el','erb','g','hml','htm','html','java','js','json','jsp','less','nsh','nsi','php','php3','pl','py','rb','rhtml','rss','sass','scala','scm','scpt','scptd','scss','sh','shtml','wsh','xhtml','xml','yml'),
		'text'		=> array('asc','csv','diz','markdown','md','nfo','rst','rtf','text','txt'),
		'video'		=> array('3g2','3gp','3gp2','3gpp','asf','avi','bik','bup','divx','flv','ifo','m4v','mkv','mkv','mov','mp4','mpeg','mpg','ogv','qt','smk','swf','vob','webm','wmv','xvid'),
		'windows'	=> array('dll','exe','msi','ps1','scr','sys')
	);
}

$cdn_pre = '//netdna.bootstrapcdn.com/bootswatch/3.0.0/';
$cdn_post = '/bootstrap.min.css';

switch(BOOTSTRAP_THEME) {
	case 'amelia':
		$bootstrap_cdn = $cdn_pre .'amelia'. $cdn_post;
		break;
	case 'cerulean':
		$bootstrap_cdn = $cdn_pre .'cerulean'. $cdn_post;
		break;
	case 'cosmo':
		$bootstrap_cdn = $cdn_pre .'cosmo'. $cdn_post;
		break;
	case 'cyborg':
		$bootstrap_cdn = $cdn_pre .'cyborg'. $cdn_post;
		break;
	case 'flatly':
		$bootstrap_cdn = $cdn_pre .'flatly'. $cdn_post;
		break;
	case 'journal':
		$bootstrap_cdn = $cdn_pre .'journal'. $cdn_post;
		break;
	case 'readable':
		$bootstrap_cdn = $cdn_pre .'readable'. $cdn_post;
		break;
	case 'simplex':
		$bootstrap_cdn = $cdn_pre .'simplex'. $cdn_post;
		break;
	case 'slate':
		$bootstrap_cdn = $cdn_pre .'slate'. $cdn_post;
		break;
	case 'spacelab':
		$bootstrap_cdn = $cdn_pre .'spacelab'. $cdn_post;
		break;
	case 'united':
		$bootstrap_cdn = $cdn_pre .'united'. $cdn_post;
		break;
	case 'paraiso':
		$bootstrap_cdn = '//idleberg.github.io/Paraiso-Bootstrap-Listr/stylesheets/bootstrap.paraiso.min.css';
		break;
	default:
		if(ENABLE_ICONS) {
			$bootstrap_cdn = '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css';
		} else {
			$bootstrap_cdn = '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.no-icons.min.css';
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
if ($handle = opendir('.'))
{
	// ...start scanning through it.
    while (false !== ($file = readdir($handle)))
	{
		// Make sure we don't list this folder,file or their links.
        if ($file != "." && $file != ".." && $file != $this_script && !in_array($file, $ignore_list) && (substr($file, 0, 1) != '.'))
		{
			// Get file info.
			$info				=	pathinfo($file);
			// Organize file info.
			$item['name']		=	$info['filename'];
			$item['lname']		=	strtolower($info['filename']);
			$item['bname']		=	$info['basename'];
			$item['lbname']		=	strtolower($info['basename']);
			$item['ext']		=	$info['extension'];
			$item['lext']		=	strtolower($info['extension']);
			if($info['extension'] == '') $item['ext'] = '.';

			if (ENABLE_ICONS && ENABLE_AWESOME) {
				$sort_icon = 'fa fa-sort';
				$folder_icon = 'fa fa-folder';
				if(in_array($item[lext], $filetype['archive'])){
					$item['class'] = 'fa fa-archive';
				}elseif(in_array($item[lext], $filetype['apple'])){
					$item['class'] = 'fa fa-apple';
				}elseif(in_array($item[lext], $filetype['audio'])){
					$item['class'] = 'fa fa-music';
				}elseif(in_array($item[lext], $filetype['calendar'])){
					$item['class'] = 'fa fa-calendar';
				}elseif(in_array($item[lext], $filetype['config'])){
					$item['class'] = 'fa fa-cogs';
				}elseif(in_array($item[lext], $filetype['contact'])){
					$item['class'] = 'fa fa-group';
				}elseif(in_array($item[lext], $filetype['doc'])){
					$item['class'] = 'fa fa-file-text';
				}elseif(in_array($item[lext], $filetype['downloads'])){
					$item['class'] = 'fa fa-cloud-download';
				}elseif(in_array($item[lext], $filetype['ebook'])){
					$item['class'] = 'fa fa-book';
				}elseif(in_array($item[lext], $filetype['email'])){
					$item['class'] = 'fa fa-envelope';
				}elseif(in_array($item[lext], $filetype['font'])){
					$item['class'] = 'fa fa-font';
				}elseif(in_array($item[lext], $filetype['image'])){
					$item['class'] = 'fa fa-picture-o';
				}elseif(in_array($item[lext], $filetype['link'])){
					$item['class'] = 'fa fa-link';
				}elseif(in_array($item[lext], $filetype['linux'])){
					$item['class'] = 'fa fa-linux';
				}elseif(in_array($item[lext], $filetype['palette'])){
					$item['class'] = 'fa fa-tasks';
				}elseif(in_array($item[lext], $filetype['raw'])){
					$item['class'] = 'fa fa-camera';
				}elseif(in_array($item[lext], $filetype['script'])){
					$item['class'] = 'fa fa-code';
				}elseif(in_array($item[lext], $filetype['text'])){
					$item['class'] = 'fa fa-file-text-o';
				}elseif(in_array($item[lext], $filetype['video'])){
					$item['class'] = 'fa fa-film';
				}elseif(in_array($item[lext], $filetype['windows'])){
					$item['class'] = 'fa fa-windows';
				}else{
					$item['class'] = 'fa fa-file-o';		
				}
			} else {
				$sort_icon = 'glyphicon glyphicon-sort';
				$folder_icon = 'glyphicon glyphicon-folder-close';
				$item['class'] = 'glyphicon glyphicon-file';
			}

			if ($table_options['size'] || $table_options['age'])
			$stat				=	stat($file); // ... slow, but faster than using filemtime() & filesize() instead.

			if ($table_options['size']) {
				$item['bytes']		=	$stat['size'];
				$item['size']		=	bytes_to_string($stat['size'], 2);
			}

			if ($table_options['age']) {
				$item['mtime']		=	$stat['mtime'];
			}
			
			if ($table_options['perms']) {
				$item['perms']		=	substr(sprintf('%o', fileperms($file)), -4);
			}
			
			// Add files to the file list...
			if(is_dir($info['basename'])){
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
	if (isset($contained)){
		$contained .= ' and '.$total_files.' '.$iunit;
	}else{
		$contained = $total_files.' '.$iunit;	
	}
	$contained = $contained.', '.$total_size['num'].' '.$total_size['str'].' in total';
}

/*** FUNCTIONS ***/

/**
 *	http://us.php.net/manual/en/function.array-multisort.php#83117
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
 *	@ http://us3.php.net/manual/en/function.filesize.php#84652
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
 *	@ http://us.php.net/manual/en/function.time.php#71342
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


/*** HTML TEMPLATE ***/

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"> 
	<? if (ENABLE_VIEWPORT) { ?><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"><? } ?>
	<title>Index of <?=$this_domain?><?=$this_folder?></title>
	<? if (FAV_ICON) { ?><link rel="shortcut icon" href="<?=FAV_ICON?>"><? } ?>
	<? if (IPHONE_ICON) { ?><link rel="apple-touch-icon" href="<?=IPHONE_ICON?>" /><? } ?>
    <? if (IPHONE_ICON_RETINA) { ?><link rel="apple-touch-icon" sizes="72x72" href="<?=IPHONE_ICON_RETINA?>" /><? } ?>
    <? if (IPAD_ICON) { ?><link rel="apple-touch-icon" sizes="114x114" href="<?=IPAD_ICON?>" /><? } ?>
    <? if (IPAD_ICON_RETINA) { ?><link rel="apple-touch-icon" sizes="144x144" href="<?=IPAD_ICON_RETINA?>" /><? } ?>
	<link rel="stylesheet" href="<?=$bootstrap_cdn?>" />
	<? if (ENABLE_AWESOME) { ?><link rel="stylesheet" href="<?=FONT_AWESOME?>" /><? } ?>
	<style type="text/css">th {cursor: pointer}<?if (ENABLE_ICONS && ENABLE_AWESOME) { ?>i:before{width:28px}<? } ?></style>
</head>
<body>
	<div class="container">
		<h1>
			<a href="http://<?=$this_domain?>"><?=$this_domain?></a><? foreach($dir_name as $dir => $name) : ?>
				<? if(($name != ' ') && ($name != '') && ($name != '.') && ($name != '/')): ?>
					<? $parent = ''; ?>
						<?for ($i = 1; $i <= $dir; $i++): ?>
							<? $parent .= rawurlencode($dir_name[$i]) . '/'; ?>
						<?endfor;?>
					/ <a href="/<?=$parent?>"><?=utf8_encode($name)?></a>
				<?endif; ?>
			<? endforeach; ?>
		</h1>
		<table id="bs-table" class="table <?=TABLE_STYLE?>">
			<thead>
				<tr>
					<th<? if (ENABLE_SORT) { ?> data-sort="string"<? } ?>><? if (ENABLE_SORT) { ?><? if (ENABLE_ICONS) { ?><i class="<?=$sort_icon?>">&nbsp;</i><? } ?><? } ?>Name</th>
					<? if ($table_options['size']) { ?><th<? if (ENABLE_SORT) { ?> data-sort="int"<? } ?>>Size</th><? } ?>
					<? if ($table_options['age']) { ?><th<? if (ENABLE_SORT) { ?> data-sort="int"<? } ?>>Date Modified</th><? } ?>
					<? if ($table_options['perms']) { ?><th<? if (ENABLE_SORT) { ?> data-sort="int"<? } ?>>Permissions</th><? } ?>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<td colspan="<?=$table_count+1?>"><small class="pull-left"><?=$contained?></small><small class="pull-right">Fork me on <a href="https://github.com/idleberg/Bootstrap-Listr" target="_blank">GitHub</a></small></td>
				</tr>
			</tfoot>
			<tbody>
		<!-- folders -->
		<? if(($folder_list) || ($file_list) ) { ?>
			<? if($folder_list): ?>
			<? foreach($folder_list as $item) : ?>
					<tr>
						<td<? if (ENABLE_SORT) { ?> data-sort-value="<?=utf8_encode($item['lbname'])?>"<? } ?>><? if (ENABLE_ICONS) { ?><i class="<?=$folder_icon?>">&nbsp;</i><? } ?><a href="<?=rawurlencode($item['bname'])?>/"><strong><?=utf8_encode($item['bname'])?></strong></a></td>
						<? if ($table_options['size']) { ?><td<? if (ENABLE_SORT) { ?> data-sort-value="0"<? } ?>>&mdash;</td><? } ?>
						<? if ($table_options['age']) { ?><td<? if (ENABLE_SORT) { ?> data-sort-value="<?=$item['mtime']?>"<? } ?>><?=time_ago($item['mtime'])?>ago</td><? } ?>
						<? if ($table_options['perms']) { ?><td><?=$item['perms']?></td><? } ?>
					</tr>
			<? endforeach; ?>
			<? endif; ?>
			<!-- files -->
			<? if($file_list): ?>
			<? foreach($file_list as $item) : ?>
					<tr>
						<td<? if (ENABLE_SORT) { ?> data-sort-value="<?=utf8_encode($item['lname'])?>"<? } ?>><? if (ENABLE_ICONS) { ?><i class="<?=$item['class']?>">&nbsp;</i><? } ?><a href="<?=rawurlencode($item['bname'])?>"><?=utf8_encode($item['bname'])?></a></td>
						<? if ($table_options['size']) { ?><td<? if (ENABLE_SORT) { ?> data-sort-value="<?=$item['bytes']?>"<? } ?>><?=$item['size']['num']?> <span><?=$item['size']['str']?></span></td><? } ?>
						<? if ($table_options['age']) { ?><td<? if (ENABLE_SORT) { ?> data-sort-value="<?=$item['mtime']?>"<? } ?>><?=time_ago($item['mtime'])?>ago</td><? } ?>
						<? if ($table_options['perms']) { ?><td><?=$item['perms']?></td><? } ?>
					</tr>
			<? endforeach; ?>
			<? endif; ?>
		<? } else { ?>
			<tr>
				<td colspan="<?=$table_count+1?>" style="font-style:italic"><? if (ENABLE_ICONS) { ?><i class="<?=$item['class']?>">&nbsp;</i><? } ?>empty folder</td>
			</tr>
		<? } ?>
			</tbody>                          
		</table>
	</div>
	<? if (ENABLE_SORT) { ?>
		<script type="text/javascript" src="<?=JQUERY?>"></script>
		<script type="text/javascript" src="<?=STUPID_TABLE?>"></script>
		<script type="text/javascript">$("#bs-table").stupidtable();</script>
	<? } ?>
	<? if (ANALYTICS_ID) { ?>
		<script type="text/javascript">var _gaq=_gaq||[];_gaq.push(["_setAccount","<?=ANALYTICS_ID?>"]);_gaq.push(["_trackPageview"]);(function(){var ga=document.createElement("script");ga.type="text/javascript";ga.async=true;ga.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ga,s)})();</script>
	<? } ?>
</body>
</html>