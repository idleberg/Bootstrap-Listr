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

// Get protocol
// if ($_SERVER['HTTPS']) {
//     $protocol = "https://";
// } else {
//     $protocol = "http://";
// }

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
    case "glyphicon":
    case "glyphicons":
        $icons['prefix'] = "glyphicon";
        $icons['home']   = "<span class=\"glyphicon ".$icons['home']."\"></span>";
        $icons['search'] = "          <span class=\"glyphicon ".$icons['search']." form-control-feedback\"></span>" . PHP_EOL;
        $icons['folder'] = 'glyphicon '.$icons['folder'];
        break;
    case "fontawesome":
    case "fa":
    case "fa-files":
        $icons['prefix'] = "fa";
        $icons['home']   = "<i class=\"fa ".$icons['home']." fa-lg fa-fw\"></i> ";
        $icons['search'] = "          <i class=\"fa ".$icons['search']." form-control-feedback\"></i>" . PHP_EOL;
        $icons['folder'] = 'fa '. $icons['folder'].' ' . $options['bootstrap']['fontawesome_style'];
        if ($options['general']['share_icons'] == true) { 
            $icons_dropbox  = "<i class=\"fa fa-dropbox fa-fw\" aria-hidden=\"true\"></i> ";
            $icons_email    = "<i class=\"fa fa-envelope fa-fw\" aria-hidden=\"true\"></i> ";
            $icons_facebook = "<i class=\"fa fa-facebook fa-fw\" aria-hidden=\"true\"></i> ";
            $icons_gplus    = "<i class=\"fa fa-google-plus fa-fw\" aria-hidden=\"true\"></i> ";
            $icons_twitter  = "<i class=\"fa fa-twitter fa-fw\" aria-hidden=\"true\"></i> ";
        }
        break;
    default:
        $icons['home']   = $_SERVER['HTTP_HOST'];
        $icons['search'] = null;
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
    $search_offset = " col-xs-offset-6 col-sm-offset-8 col-md-offset-9";
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
                $item['lext'] = strtolower($info['extension']);
            } else {
                $item['ext'] = '.';
                $item['lext'] = '.';
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
                $item['iso_mtime']  =   date("Y-m-d H:i:s", $item['mtime']);
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
    natural_sort($folder_list, 'bname', false, true);
// Sort file list.
if($file_list)
    natural_sort($file_list, 'bname', false, true);
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
    $search .= "      <div class=\"col-xs-6 col-sm-4 col-md-3$search_offset\">" . PHP_EOL;
    $search .= "          <div class=\"form-group has-feedback\">" . PHP_EOL;
    $search .= "            <label class=\"control-label sr-only\" for=\"search\">". _('Search')."</label>" . PHP_EOL;
    $search .= "            <input type=\"text\" class=\"form-control$input_size\" id=\"search\" placeholder=\"". _('Search')."\"$autofocus>" . PHP_EOL;
    $search .= $icons['search'];
    $search .= "         </div>" . PHP_EOL; // form-group
    $search .= "      </div>" . PHP_EOL; // col
    $search .= "    </div>" . PHP_EOL; // row
}

// Set table header
$table_header = null;

if ($table_options['count']) {
    $table_header .= "            <th class=\"text-".$right."\" data-sort=\"int\">#</th>" . PHP_EOL;
}

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

if ($table_options['count']) {
    $row_counter = 1;
}

if(($folder_list) || ($file_list) ) {

    if($folder_list):    
        foreach($folder_list as $item) :

            if (isset($options['bootstrap']['tablerow_folders'])) {
                $tr_folders = ' class="'.$options['bootstrap']['tablerow_folders'].'"';
            } else {
                $tr_folders = null;
            }

            $table_body .= "          <tr$tr_folders>" . PHP_EOL;

            if ($table_options['count']) {
                $table_body .= "            <td class=\"text-muted text-".$right."\" data-sort-value=\"$row_counter\">$row_counter</td>";
            }

            $table_body .= "            <td";
            if ($options['general']['enable_sort']) {
                $table_body .= " class=\"text-".$left."\" data-sort-value=\"". htmlentities($item['lbname'], ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body .= ">";
            if (isset($options['bootstrap']['icons'])) {
                $table_body .= "<".$icons['tag']." class=\"".$icons['folder']."\" aria-hidden=\"true\"></".$icons['tag'].">&nbsp;";
            }

            if (isset($options['bootstrap']['tablerow_links'])) {
                $tr_links = ' class="'.$options['bootstrap']['tablerow_links'].'"';
            } else {
                $tr_links = null;
            }

            $table_body .= "<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "/\" $tr_links><strong>" . utf8ify($item['bname']) . "</strong></a></td>" . PHP_EOL;
            
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
            if (in_array($item['bname'], $options['hidden_files'])) {
                $row_classes[] = "hidden";
                // muted class on row…
                $row_classes[] = $options['bootstrap']['hidden_files_row'];
                // …and again for the link
                $file_classes[] = $options['bootstrap']['hidden_files_link'];
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
                $size_attr = null;
            } else {
                $virtual_attr = null;
                $size_attr = " data-size=\"".$item_pretty_size."\"";
            }

            // Concatenate tr-classes
            if (!empty($row_classes)) {
                $row_attr = ' class="'.implode(" ", $row_classes).'"';
            } else {
                $row_attr = null;
            }

            $table_body .= "          <tr$row_attr>" . PHP_EOL;
            
            if ($table_options['count']) {
                $table_body .= "            <td class=\"text-muted text-".$right."\" data-sort-value=\"$row_counter\">$row_counter</td>";
            }
            
            $table_body .= "            <td";
            if ($options['general']['enable_sort']) {
                $table_body .= " class=\"text-".$left."\" data-sort-value=\"". htmlentities($item['lbname'], ENT_QUOTES, 'utf-8') . "\"" ;
            }
            $table_body .= ">";
            if ($options['bootstrap']['icons'] !== null ) {
                $table_body .= "<".$icons['tag']." class=\"" . $item['class'] . "\" aria-hidden=\"true\"></".$icons['tag'].">&nbsp;";
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

            $table_body .= "<a href=\"" . htmlentities(rawurlencode($item['bname']), ENT_QUOTES, 'utf-8') . "\"$file_attr$file_data$virtual_attr$size_attr>" . utf8ify($display_name) . "</a></td>" . PHP_EOL;

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
            $table_body .= "<".$icons['tag']." class=\"" . $item['class'] . "\" aria-hidden=\"true\">&nbsp;</".$icons['tag'].">";
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
