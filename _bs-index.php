<?php

error_reporting(1);

/*
 *		Bootstrap Director Lister
 *
 *       Author:    Jan T. Sott
 *         Info:    http://github.com/idleberg/Bootstrap-Directory-Lister
 *      License:    Creative Commons 3.0 Attribution-ShareAlike 3.0
 *
 *		Credits:	Greg Johnson - PHPDL lite (http://greg-j.com/phpdl/)
 *					Na Wong - Listr (http://nadesign.net/listr/)
 */

/***[ BOOTSTRAP ]***/

// Use 'table-striped' to add zebra-striping 
// Add 'table-bordered' for borders on all sides of the table and cells
// Add 'table-hover' to enable a hover state on table rows
// Add 'table-condensed' to make tables more compact by cutting cell padding in half
// Create responsive tables by wrapping any table in 'table-responsive'
$table_style = 'table-hover table-responsive';

// Default link color in Bootstrap 3.0 is #428bca
$icon_color = '#428bca';


/***[ SETTINGS ]***/ 

// Set sorting properties.
$sort = array(
	array('key'=>'lname',	'sort'=>'asc'), // ... this sets the initial sort "column" and order ...
	array('key'=>'size',	'sort'=>'asc') // ... for items with the same initial sort value, sort this way.
);
// Files you want to hide form the listing
$ignore_list = array('.DAV','.DS_Store','.git','.gitignore','.htaccess','_bs-dist','_bs-index.php','robots.txt');



/***[ DIRECTORY LOGIC ]***/
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



// Open the current directory...
if ($handle = opendir('.'))
{
	// ...start scanning through it.
    while (false !== ($file = readdir($handle)))
	{
		// Make sure we don't list this folder, file or their links.
        if ($file != "." && $file != ".." && $file != $this_script && !in_array($file, $ignore_list))
		{
			// Get file info.
			$stat				=	stat($file); // ... slow, but faster than using filemtime() & filesize() instead.
			$info				=	pathinfo($file);
			// Organize file info.
			$item['name']		=	$info['filename'];
			$item['lname']		=	strtolower($info['filename']);
			$item['ext']		=	$info['extension'];
			$item['lext']		=	strtolower($info['extension']);
			if($info['extension'] == '') $item['ext'] = '.';
			
			$item['bytes']		=	$stat['size'];
			$item['size']		=	bytes_to_string($stat['size'], 2);
			$item['mtime']		=	$stat['mtime'];
			// Add files to the file list...
			if($info['extension'] != ''){
				array_push($file_list, $item);
			}
			// ...and folders to the folder list.
			else{
				array_push($folder_list, $item);
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
		$iunit = 'items';
	}else{
		$iunit = 'item';
	}
	if (isset($contained)){
		$contained .= ' &amp; '.$total_files.' '.$iunit;
	}else{
		$contained = $total_files.' '.$iunit;	
	}
}

/***[ FUNCTIONS ]***/

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
	$sizes = array('YB', 'ZB', 'EB', 'PB', 'TB', 'GB', 'MB', 'KB', 'Bytes');
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


/***[ HTML TEMPLATE ]***/
?>
<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8"> 
			<meta name="author" content="Na Wong"> 
			<meta name="copyright" content="Na&rsquo;Design"> 
			<title>Index of <?=$this_domain?><?=$this_folder?></title>
			<link rel="icon" href="listr-favicon.png">
			<link rel="stylesheet" href="_bs-dist/css/bootstrap.min.css">
			<style type="text/css">i {color:<?=$icon_color?>;}</style>
		</head>

		<body>
			<div class="container">
				<h1>
					<a href="http://<?=$this_domain?>"><?=$this_domain?></a><? foreach($dir_name as $dir => $name) : ?>
						<? if(($name != ' ') && ($name != '') && ($name != '.') && ($name != '/')): ?>
							<? $parent = ''; ?>
								<?for ($i = 1; $i <= $dir; $i++): ?>
									<? $parent .= $dir_name[$i] . '/'; ?>
								<?endfor;?>
							/ <a href="/<?=$parent?>"><?=$name?></a>
						<?endif; ?>
					<? endforeach; ?>
				</h1>

				<table class="table <?=$table_style?>">

					<thead>
						<tr>
							<th>Name</td>
							<th>Size</td>
							<th>Age</td>
						</tr>
					</thead>
					<tfoot>
						<tr>
							<td colspan="2"><small><? if($folder_list): ?>This folder has <?=count($file_list)?> files totaling <?=$total_size['num']?> <?=$total_size['str']?> in size<? endif; ?></small></td>
							<td><small class="pull-right">Fork me on <a href="#">GitHub</a></small></td>
						</tr>
					</tfoot>
					<tbody>
				<!-- folders -->
				<? if($folder_list): ?>
				<? foreach($folder_list as $item) : ?>
						<tr>
							<td><i class="glyphicon glyphicon-folder-close">&nbsp;</i><a href="<?=$item['name']?>/"><strong><?=$item['name']?></strong></a></td>
							<td>n/a</td>
							<td><?=time_ago($item['mtime'])?>old</td>
						</tr>
				<? endforeach; ?>
				<? endif; ?>
				<!-- /folders -->
				<!-- files -->
				<? if($file_list): ?>
				<? foreach($file_list as $item) : ?>
						<tr>
							<td><i class="glyphicon glyphicon-file">&nbsp;</i><a href="<?=$item['name']?>.<?=$item['ext']?>"><?=$item['name']?>.<?=$item['ext']?></a></td>
							<td><?=$item['size']['num']?><span><?=$item['size']['str']?></span></td>
							<td><?=time_ago($item['mtime'])?>old</td>
						</tr>
				<? endforeach; ?>
				<? endif; ?>
				<!-- /files -->
					</tbody>                          
				</table>
			</div>
		</body>
	</html>
