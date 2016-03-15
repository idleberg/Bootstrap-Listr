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
// require_once('parsedown/Parsedown.php');

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

// $readme_content = false;
// $readme_exists  = false;

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
        set_404_error($root_dir, basename($navigation_dir));
    }
    exit;
} else {
    if(!file_exists($navigation_dir)){
        set_404_error($root_dir, basename($navigation_dir));
    }
}

// Declare vars used beyond this point.
$file_list = array();
$folder_list = array();
$total_size = 0;


// Load icon set
if ($options['bootstrap']['icons'] !== null) {
    try {
        $icons = load_iconset($options['bootstrap']['icons']);
    } catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
        die();
    }
}

// Set icons for included extension
if (!empty($icons['files'])) {
    foreach ($icons['files'] as $type => $ext) {
        foreach ($ext as $k => $v) {
            $filetype[$k]['extensions'] = $v['extensions'];
            $filetype[$k]['icon'] = $v['icon'];
        }
    }
}

switch ($options['bootstrap']['icons']) {
    case "fontawesome":
    case "fa":
    case "fa-files":
        // TODO: move to theme
        $icons['prefix'] = "fa fa-fw";
        $icons['home']   = "<i class=\"".$icons['prefix']." ".$icons['home']." fa-lg\"></i> ";
        $icons['folder'] = $icons['prefix'].' '. $icons['folder'].' ' . $options['bootstrap']['fontawesome_style'];
        if ($options['general']['share_icons'] == true) { 
            $icons_dropbox  = "<i class=\"".$icons['prefix']." fa-dropbox\"></i> ";
            $icons_email    = "<i class=\"".$icons['prefix']." fa-envelope\"></i> ";
            $icons_facebook = "<i class=\"".$icons['prefix']." fa-facebook\"></i> ";
            $icons_gplus    = "<i class=\"".$icons['prefix']." fa-google-plus\"></i> ";
            $icons_twitter  = "<i class=\"".$icons['prefix']." fa-twitter\"></i> ";
        }
        break;
    default:
        $icons['home']   = $_SERVER['HTTP_HOST'];
        // $icons['search'] = null;
}

if ($options['general']['enable_viewer']) {
    $audio_files     = explode(',', $options['viewer']['audio']);
    $image_files     = explode(',', $options['viewer']['image']);
    $pdf_files       = explode(',', $options['viewer']['pdf']);
    $quicktime_files = explode(',', $options['viewer']['quicktime']);
    $source_files    = explode(',', $options['viewer']['source']);
    $text_files      = explode(',', $options['viewer']['text']);
    $video_files     = explode(',', $options['viewer']['video']);
    $website_files   = explode(',', $options['viewer']['website']);
    if ( ($options['general']['virtual_files'] == true) && ($options['general']['enable_viewer'] == true) ){
        $virtual_files     = explode(',', $options['viewer']['virtual']);
    }
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
    $search_offset = " col-sm-offset-7 col-md-offset-8";
}

$bootstrap_cdn = set_bootstrap_theme();

// Set Bootstrap defaults
if (isset($options['bootstrap']['body_style'])) {
    $body_style = ' class="' . $options['bootstrap']['body_style'] . '"';
} else {
    $body_style = null;
}

if (isset($options['bootstrap']['container_style'])) {
    $container_style = " ".$options['bootstrap']['container_style'];
} else {
    $container_style = null;
}

if (isset($options['bootstrap']['modal_size'])) {
    $modal_size = $options['bootstrap']['modal_size'];
} else {
    $modal_size = 'modal-lg';
}

if (isset($options['bootstrap']['button_default'])) {
    $btn_default = $options['bootstrap']['button_default'];
} else {
    $btn_default = 'btn-secondary';
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
$table_count = 1;
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
        if ($file != "." && $file != ".." && $file != $this_script && !in_array_regex($file, $ignore_list) )
        {
            if ( ($options['general']['hide_dotfiles'] == true) && (substr($file, 0, 1) == '.') ) {
                continue;
            }

            // Get file info.
            $info                  =    pathinfo($file);

            // Check is readme enabled, and load file, if exists
            // if ($info['basename'] == $options['general']['dir_readme_fname'] && $options['general']['dir_readme'] == true) {
            //     if (($readme = file_get_contents($navigation_dir.$info['basename'])) != false ) {
            //         $readme_content = $readme;
            //         $readme_exists = true;
            //     }
            //     continue;
            // }

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

            // If enable_checksums, ignore checksum files or read in checksum
            if ( ($options['general']['enable_checksums'] == true)) {
                // Skip checksum files
                if (in_array($item['lext'], $options["checksum_files"])) {
                    continue;
                }
                
                // Look for checksum files
                foreach ($options["checksum_files"] as $chksum_ext) {
                    // $item itself is copied over and over for each file so delete those additional attributes to prevent unwanted carry-over
                    if (array_key_exists($chksum_ext, $item)) {
                        unset($item[$chksum_ext]);
                    }
            
                    $checksum_file = $navigation_dir . $file . '.' . $chksum_ext;
                    // Found 
                    if (file_exists($checksum_file)) {
                        // Read in
                        $checksum_content = file_get_contents($checksum_file, FILE_USE_INCLUDE_PATH);
                        $checksum_breakdown = explode(" ", $checksum_content);
                        // Quick validation
                        if ( (count($checksum_breakdown) >= 2) && (strlen($checksum_breakdown[0]) > 8)) {
                            // Keep checksum string
                            $item[$chksum_ext] = $checksum_breakdown[0];
                        }
                    }
                }
            }

            // Assign file icons
            $item['class'] = $icons['prefix'].' '.$icons['default'].' '. $options['bootstrap']['fontawesome_style'];
            
            foreach ($filetype as $v) {
                if (in_array($item['lext'], $v['extensions'])) {
                    $item['class'] = $icons['prefix'].' '.$v['icon'].' '. $options['bootstrap']['fontawesome_style'];
                }
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
$breadcrumbs  = "    <div class=\"row\">" . PHP_EOL;
$breadcrumbs .= "      <div class=\"col-xs-12\">" . PHP_EOL;
$breadcrumbs .= "        <ol class=\"breadcrumb$breadcrumb_style\"".$direction.">" . PHP_EOL;
$breadcrumbs .= "          <li><a href=\"".htmlentities($root_dir, ENT_QUOTES, 'utf-8')."\">".$icons['home']."</a></li>" . PHP_EOL;
foreach($dir_name as $dir => $name) :
    if(($name != ' ') && ($name != '') && ($name != '.') && ($name != '/')):
        $parent = '';
        for ($i = 0; $i <= $dir; $i++):
            $parent .= rawurlencode($dir_name[$i]) . '/';
        endfor;
        $breadcrumbs .= "          <li><a href=\"".htmlentities($absolute_path.$parent, ENT_QUOTES, 'utf-8')."\">".$name."</a></li>" . PHP_EOL;
    endif;
endforeach;
$breadcrumbs = $breadcrumbs."        </ol>" . PHP_EOL;
$breadcrumbs = $breadcrumbs."      </div>" . PHP_EOL;

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

    $search .= "      <div class=\"col-xs-12 col-sm-5 col-md-4$search_offset\">" . PHP_EOL;
    $search .= "          <div class=\"form-group\">" . PHP_EOL;
    $search .= "            <label class=\"form-control-label sr-only\" for=\"listr-search\">". _('Search')."</label>" . PHP_EOL;
    $search .= "            <input type=\"text\" id=\"listr-search\" class=\"form-control$input_size\" placeholder=\"". _('Search')."\"$autofocus>" . PHP_EOL;
    // $search .= $icons['search'];
    $search .= "         </div>" . PHP_EOL; // form-group
    $search .= "      </div>" . PHP_EOL; // col
    $search .= "    </div>" . PHP_EOL; // row
}

// Show readme
// $dir_readme = null;

// if ($options['general']['dir_readme'] == true && $readme_exists == true) {
//     $Parsedown = new Parsedown();

//     $dir_readme  = "    <div class=\"card\">" . PHP_EOL;
//     $dir_readme .= "      <div class=\"card-header\">" . PHP_EOL;
//     $dir_readme .= "        <b>" . $options['general']['dir_readme_fname'] . "</b>" . PHP_EOL;
//     $dir_readme .= "      </div>" . PHP_EOL;
//     $dir_readme .= "      <div class=\"card-block\">" . PHP_EOL;
//     $dir_readme .= "        <div class=\"card-text\"> " . PHP_EOL;
//     $dir_readme .= "          <div class=\"markdown-body\">" . PHP_EOL;
//     $dir_readme .= $Parsedown->text($readme_content);
//     $dir_readme .= "          </div>" . PHP_EOL;
//     $dir_readme .= "        </div> " . PHP_EOL;
//     $dir_readme .= "      </div> " . PHP_EOL;
//     $dir_readme .= "    </div>" . PHP_EOL;
// }

// Set table header
$table_header = null;

$table_header .= "            <th class=\"text-xs-$left\" data-sort=\"string\">"._('Name')."</th>" . PHP_EOL;

if ($table_options['size']) {
    $table_header .= "            <th";
    if ($options['general']['enable_sort']) {
        $table_header .= " class=\"text-xs-$right\" data-sort=\"int\">";
    } else {
        $table_header .= ">";
    }
    $table_header .= _('Size')."</th>" . PHP_EOL;
}

if ($table_options['age']) {
    $table_header .= "            <th";
    if ($options['general']['enable_sort']) {
        $table_header .= " class=\"text-xs-$right\" data-sort=\"int\">";
    } else {
        $table_header .= ">";
    }
    $table_header .= _('Modified')."</th>" . PHP_EOL;
}

// Set table body
$table_body = null;

if ($table_options['count']) {
    $row_counter = 1;
}

if(($folder_list) || ($file_list) ) {

    if($folder_list):    
        foreach($folder_list as $item) :

            if ($options['bootstrap']['tablerow_folders'] != null) {
                $tr_folders = ' class="'.$options['bootstrap']['tablerow_folders'].'"';
            } else {
                $tr_folders = null;
            }

            $table_body .= "          <tr$tr_folders>" . PHP_EOL;

            $table_body .= "            <td";
            if ($options['general']['enable_sort']) {
                $table_body .= " class=\"text-xs-$left\" data-sort-value=\"dir-". htmlentities($item['lbname'], ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body .= ">";
            if ($options['bootstrap']['icons'] !== null ) {
                $table_body .= "<".$icons['tag']." class=\"".$icons['folder']."\"></".$icons['tag'].">&nbsp;";
            }

            if ($options['bootstrap']['tablerow_links'] != null) {
                $tr_links = ' class="'.$options['bootstrap']['tablerow_links'].'"';
            } else {
                $tr_links = null;
            }

            $table_body .= "<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "/\" $tr_links><strong>" . utf8ify($item['bname']) . "</strong></a></td>" . PHP_EOL;
            
            if ($table_options['size']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-xs-$right\" data-sort-value=\"-1\"";
                }
                $table_body .= ">&mdash;</td>" . PHP_EOL;
            }

            if ($table_options['age']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-xs-$right\" data-sort-value=\"" . $item['mtime'] . "\"";
                    $table_body .= " title=\"" . $item['iso_mtime'] . "\"";
                }
                $table_body .= ">" . time_ago($item['mtime']) . "</td>" . PHP_EOL;
            }

            $table_body .= "          </tr>" . PHP_EOL;

            if ($table_options['count']) {
                $row_counter += 1;
            }

        endforeach;
    endif;

    if($file_list):
        foreach($file_list as $item) :

            $row_classes  = array();
            $file_classes = array();
            $file_meta = array();

            $item_pretty_size = $item['size']['num'] . " " . $item['size']['str'];

            // Style table rows
            if ($options['bootstrap']['tablerow_files'] != "") {
                $row_classes[] = $options['bootstrap']['tablerow_files'];
            }

            // Is file hidden?
            if (in_array_regex($item['bname'], $options['hidden_files'])){
                if (!isset($_GET["reveal"])) {
                    $row_classes[]  = " hidden-xs-up";
                }
                // muted class on row…
                $row_classes[] = $options['bootstrap']['hidden_files_row'];
                // …and again for the link
                $file_classes[] = $options['bootstrap']['hidden_files_link'];
                $visible_count = null;
            } else {
                $visible_count = $row_counter;
            }

            // Is virtual file?
            if ( ($options['general']['virtual_files'] == true) && (in_array($item['lext'], $virtual_files)) ){

                if ( is_int($options['general']['virtual_maxsize']) == true) {
                    $virtual_maxsize = $options['general']['virtual_maxsize'];
                } else {
                    $virtual_maxsize = 256;
                }
                if  (filesize($navigation_dir.$item['bname']) <= $virtual_maxsize) {

                    $virtual_file =  json_decode(file_get_contents($navigation_dir.$item['bname'], true), true);

                    if ($item['lext'] == 'flickr') {
                        $virtual_attr =  ' data-flickr="'.htmlentities($virtual_file['user']).'/'.htmlentities($virtual_file['id']).'"';
                        if ( $virtual_file['album'] != null) {
                            $album = '/in/album-'.htmlentities($virtual_file['album']);
                        } else {
                            $album = null;
                        }
                        $virtual_attr .= ' data-url="https://www.flickr.com/'.htmlentities($virtual_file['user']).'/'.htmlentities($virtual_file['id']).$album.'"';  
                        $virtual_attr .= ' data-name="'.htmlentities($virtual_file['name']).'"';  
                    } else if ($item['lext'] == 'soundcloud') {
                        $virtual_attr =  ' data-soundcloud="'.htmlentities($virtual_file['type']).'/'.htmlentities($virtual_file['id']).'"';
                        $virtual_attr .= ' data-url="'.htmlentities($virtual_file['url']).'"';  
                        $virtual_attr .= ' data-name="'.htmlentities($virtual_file['name']).'"';  
                    } else if ($item['lext'] == 'vimeo') {
                        $virtual_attr =  ' data-vimeo="'.htmlentities($virtual_file['id']).'"';
                        $virtual_attr .= ' data-url="https://vimeo.com/'.htmlentities($virtual_file['id']).'"';  
                        $virtual_attr .= ' data-name="'.htmlentities($virtual_file['name']).'"';  
                    } else if ($item['lext'] == 'youtube') {
                        $virtual_attr =  ' data-youtube="'.htmlentities($virtual_file['id']).'"';
                        $virtual_attr .= ' data-url="https://youtube.com/watch?v='.htmlentities($virtual_file['id']).'"';  
                        $virtual_attr .= ' data-name="'.htmlentities($virtual_file['name']).'"';  
                    }
                } else {
                    $virtual_attr = null;
                }

                // Don't show file-size in .virtual-file
                $modified_attr = null;
            } else {
                $virtual_attr = null;
                $modified_attr = " data-modified=\"".$item_pretty_size."\"";
            }

            // Concatenate tr-classes
            if (!empty($row_classes)) {
                $row_attr = ' class="'.implode(" ", $row_classes).'"';
            } else {
                $row_attr = null;
            }

            $table_body .= "          <tr$row_attr>" . PHP_EOL;
            
            if ($table_options['count']) {
                // $table_body .= "            <td class=\"text-muted text-xs-$right\" data-sort-value=\"$row_counter\">$visible_count</td>";
            }
            
            $table_body .= "            <td";
            if ($options['general']['enable_sort']) {
                $table_body .= " class=\"text-xs-$left\" data-sort-value=\"file-". htmlentities($item['lbname'], ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body .= ">";
            if ($options['bootstrap']['icons'] !== null ) {
                $table_body .= "<".$icons['tag']." class=\"" . $item['class'] . "\"></".$icons['tag'].">&nbsp;";
            }
            if ($options['general']['hide_extension']) {
                $display_name = $item['name'];
            } else {
                $display_name = $item['bname'];
            }

            // inject modal class if necessary
            if ($options['general']['enable_viewer']) {
                if (in_array($item['lext'], $audio_files)) {
                    $file_classes[] = 'audio-modal';
                } else if ($item['lext'] == 'swf') {
                    $file_classes[] = 'flash-modal';
                } else if (in_array($item['lext'], $image_files)) {
                    $file_classes[] = 'image-modal';
                } else if (in_array($item['lext'], $pdf_files)) {
                    $file_classes[] = 'pdf-modal';
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
                } else if (in_array($item['lext'], $virtual_files)) {
                    $file_classes[] = 'virtual-modal';
                }
            }

            $file_data = ' '.implode(" ", $file_meta);

            if ($file_classes != null) {
                $file_attr = ' class="'.implode(" ", $file_classes).'"';
            } else {
                $file_attr = null;
            }

            $table_body .= "<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "\"$file_attr$file_data$virtual_attr$modified_attr>" . utf8ify($display_name) . "</a>";

            // Append checksum info if enabled
            if ( ($options['general']['enable_checksums'] == true) && !empty($options["checksum_files"]) ) {
                foreach ($options["checksum_files"] as $chksum_ext) {
                    if (array_key_exists($chksum_ext, $item)) {
                        // Fake indentation
                        if (  $options['bootstrap']['icons'] == 'fontawesome' || $options['bootstrap']['icons'] == 'fa' || $options['bootstrap']['icons'] == 'fa-files'  ) {
                            $fake_indent = "<span class=\"fa fa-fw\"></span> ";
                        } else {
                            $fake_indent = null;
                        }
                        // Construct href to original checksum file though client can download
                        if ($options['bootstrap']['checksum_label'] != null ) {
                            $label = "<span class=\"label ".$options['bootstrap']['checksum_label']."\">" . strtoupper($chksum_ext) . "</span> ";
                        } else {
                            $label = null;
                        }

                        // Truncate length
                        if( (is_integer($options["general"]["truncate_checksums"])) && ($options["general"]["truncate_checksums"] > 0) ){
                            $truncate = $options["general"]["truncate_checksums"];
                            $checksum = substr($item[$chksum_ext], 0, $truncate);
                        } else {
                            $checksum = $item[$chksum_ext];
                        }
                        $table_body .= "<br>$fake_indent$label <a href=\"" . htmlentities(rawurlencode($item['bname'] . "." . $chksum_ext), ENT_QUOTES, 'utf-8') . "\" class=\"text-muted\" title=\"".$item[$chksum_ext]."\">$checksum</a>" . PHP_EOL;
                    }
                }
            }
            
            $table_body .= "</td>" . PHP_EOL;

            // Size
            if ($table_options['size']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-xs-$right\" data-sort-value=\"" . $item['bytes'] . "\"";
                    $table_body .= " title=\"" . $item['bytes'] . " " ._('bytes')."\"";
                }
                    $table_body .= ">" . $item_pretty_size . "</td>" . PHP_EOL;
            }

            // Modified
            if ($table_options['age']) {
                $table_body .= "            <td";
                if ($options['general']['enable_sort']) {
                    $table_body .= " class=\"text-xs-$right\" data-sort-value=\"".$item['mtime']."\"";
                    $table_body .= " title=\"" . $item['iso_mtime'] . "\"";
                }
                $table_body .= ">" . time_ago($item['mtime']) . "</td>" . PHP_EOL;
            }

            $table_body .= "          </tr>" . PHP_EOL;

            if ($table_options['count']) {
                $row_counter += 1;
            }
        endforeach;
    endif;
} else {
        $colspan = $table_count + 1;
        $table_body .= "          <tr>" . PHP_EOL;
        $table_body .= "            <td colspan=\"$colspan\" style=\"font-style:italic\">";
        if ($options['bootstrap']['icons']  !== null ) {
            $table_body .= "<".$icons['tag']." class=\"" . $item['class'] . "\">&nbsp;</".$icons['tag'].">";
        } 
        $table_body .= _("empty folder")."</td>" . PHP_EOL;
        $table_body .= "          </tr>" . PHP_EOL;
}

// Give kudos
if ($options['general']['give_kudos']) {
    $kudos = "<a class=\"pull-xs-".$right." small text-muted\" href=\"https://github.com/idleberg/Bootstrap-Listr\" title=\"Bootstrap Listr on GitHub\" target=\"_blank\">"._('Fork me on GitHub')."</a>" . PHP_EOL;
}

require_once('listr-template.php');
?>