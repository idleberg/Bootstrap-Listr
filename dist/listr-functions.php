<?php
/*** FUNCTIONS ***/

function set_bootstrap_theme() {

    global $options;
    
    $bootswatch = array('amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti');

    if (in_array($options['bootstrap']['theme'], $bootswatch)) {
        return str_replace("%theme%",$options['bootstrap']['theme'],$options['assets']['bootswatch_css']);
    } else if ($options['bootstrap']['theme'] == "m8tro" ) {
        return $options['assets']['m8tro_css'];
    } else {
        return $options['assets']['bootstrap_css'];
    }
}

// Set header
function set_header($theme, $protocol = "//") {

    global $options;
    
    if ($options['general']['custom_title'] == null) {
        $index   = sprintf(_('Index of %1$s%2$s'), $_SERVER['HTTP_HOST'], $_SERVER['REQUEST_URI']);
    } else {
        $index   = $options['general']['custom_title'];
    }
    $header  = "  <meta charset=\"utf-8\">" . PHP_EOL;
    $header .= "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">" . PHP_EOL;
    $header .= "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=yes\">" . PHP_EOL;
    $header .= "  <meta name=\"generator\" content=\"Bootstrap Listr\" />" . PHP_EOL;
    $header .= "  <title>".$index."</title>" . PHP_EOL;

    // Set iOS touch icon sizes (https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html)
    if ($options['icons']['ios_version'] >= 7) {
        $size_iphone        = "60x60";
        $size_ipad          = "76x76";
        $size_iphone_retina = "120x120";
        $size_ipad_retina   = "152x152";
    } else {
        $size_iphone        = "57x57";
        $size_ipad          = "72x72";
        $size_iphone_retina = "114x114";
        $size_ipad_retina   = "144x144";
    }

    if ($options['icons']['fav_icon']) $header .= "  <link rel=\"shortcut icon\" href=\"".$options['icons']['fav_icon']."\" />" . PHP_EOL;
    if ($options['icons']['iphone']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"".$size_iphone."\" href=\"".$options['icons']['iphone']."\" />" . PHP_EOL;
    if ($options['icons']['ipad']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"".$size_ipad."\" href=\"".$options['icons']['ipad']."\" />" . PHP_EOL;
    if ($options['icons']['iphone_retina']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"".$size_iphone_retina."\" href=\"".$options['icons']['iphone_retina']."\" />" . PHP_EOL;
    if ($options['icons']['ipad_retina']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"".$size_ipad_retina."\" href=\"".$options['icons']['ipad_retina']."\" />" . PHP_EOL;
    if ($options['icons']['metro_tile_color']) $header .= "  <meta name=\"msapplication-TileColor\" content=\"#".$options['icons']['metro_tile_color']."\" />" . PHP_EOL;
    if ($options['icons']['metro_tile_image']) $header .= "  <meta name=\"msapplication-TileImage\" content=\"".$options['icons']['metro_tile_image']."\" />" . PHP_EOL;
    if ($options['opengraph']['title']) $header .= "  <meta property=\"og:title\" content=\"".$options['opengraph']['title']."\" />" . PHP_EOL;
    if ($options['opengraph']['description']) $header .= "  <meta property=\"og:description\" content=\"".$options['opengraph']['description']."\" />" . PHP_EOL;
    if ($options['opengraph']['site_name']) $header .= "  <meta property=\"og:site_name\" content=\"".$options['opengraph']['site_name']."\" />" . PHP_EOL;

    if ($options['keys']['google_analytics'] !== null ) {
        $header .= "  <script type=\"text/javascript\">var _gaq=_gaq||[];_gaq.push([\"_setAccount\",\"".$options['keys']['google_analytics']."\"]);_gaq.push([\"_trackPageview\"]);(function(){var ga=document.createElement(\"script\");ga.type=\"text/javascript\";ga.async=true;ga.src=(\"https:\"==document.location.protocol?\"https://ssl\":\"http://www\")+\".google-analytics.com/ga.js\";var s=document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(ga,s)})();</script>" . PHP_EOL;
    }

    if ($options['general']['dependencies'] == 'pack') {
        $packed_css = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/listr.pack.css";
        $header    .= "  <link rel=\"stylesheet\" href=\"$packed_css\" />" . PHP_EOL;
    } else {

        if ($options['general']['dependencies'] == 'cdn') {
            $bootstrap_css   = $theme;
            $fontawesome_css = $options['assets']['font_awesome'];
        } else {
            $bootstrap_css   = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/bootstrap.min.css";
            $fontawesome_css = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/font-awesome.min.css";
        }

        if ( (($options['bootstrap']['icons'] == 'fontawesome') || ($options['bootstrap']['icons'] == 'fa-files')) && ($fontawesome_css) ) {
            $header .= "  <link rel=\"stylesheet\" href=\"$fontawesome_css\" />" . PHP_EOL;
        }

        $header .= "  <link rel=\"stylesheet\" href=\"$bootstrap_css\" />" . PHP_EOL;

        if ($options['general']['enable_viewer']) {    

            if ($options['general']['enable_highlight'] == true) {
                if ( ($options['general']['dependencies'] == 'cdn') && ($options['assets']['highlight_css']) && ($options['assets']['highlight_js']) ) {
                    $header .= "  <link rel=\"stylesheet\" href=\"".$options['assets']['highlight_css']."\" />" . PHP_EOL;
                } else if ($options['general']['dependencies'] == 'local') {
                    $header .= "  <link rel=\"stylesheet\" href=\"$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/highlight.min.css\" />" . PHP_EOL;
                }
            }
        }

        $header .= "  <link rel=\"stylesheet\" href=\"$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/listr.min.css\" />" . PHP_EOL;
    }

    foreach($options['assets']['append_css'] as $append_css) {
        if ($append_css != null) {
            $header .= "  <link rel=\"stylesheet\" href=\"$append_css\" />" . PHP_EOL;
        }
    }

    if ($options['assets']['google_font']) {
        $header .= "  <link href=\"".$options['assets']['google_font']."\" rel=\"stylesheet\" type=\"text/css\">" . PHP_EOL;
    }

    return $header;

}

// Set HTML footer
function set_footer($protocol){

    $footer = null;
    global $options;

    if ($options['general']['dependencies'] == 'cdn') {
        $jquery_js    = $options['assets']['jquery'];
        $bootstrap_js = $options['assets']['bootstrap_js'];
    } else {
        $jquery_js    = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/jquery.min.js";
        $bootstrap_js = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/bootstrap.min.js";
    }

    if ( ($options['general']['enable_sort']) || ($options['general']['enable_viewer']) ) {
        $footer .= "  <script type=\"text/javascript\" src=\"$jquery_js\"></script>" . PHP_EOL;
    }

    if( ($options['general']['enable_viewer']) && ($options['general']['share_button']) && ($options['keys']['dropbox'] !== null ) ){
        $footer .= "  <script type=\"text/javascript\" src=\"//www.dropbox.com/static/api/2/dropins.js\" id=\"dropboxjs\" data-app-key=\"".$options['keys']['dropbox']."\"></script>" . PHP_EOL;
    }

    if ($options['general']['dependencies'] == 'pack') {
        $packed_js  = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/listr.pack.js";
        $footer    .= "  <script type=\"text/javascript\" src=\"$packed_js\"></script>" . PHP_EOL;
    } else {

        if($options['general']['enable_sort'] == true) {
             if ( ($options['general']['dependencies'] == 'cdn') && ($options['assets']['stupid_table']) ) {
                $footer .= "  <script type=\"text/javascript\" src=\"".$options['assets']['stupid_table']."\"></script>" . PHP_EOL;
            } else {
                $footer .= "  <script type=\"text/javascript\" src=\"$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/stupidtable.min.js\"></script>" . PHP_EOL;
            }
        }

        if ($options['general']['enable_search'] == true) {
            if ( ($options['general']['dependencies'] == 'cdn') && ($options['assets']['stupid_table']) ) {
                $footer .= "  <script type=\"text/javascript\" src=\"".$options['assets']['searcher']."\"></script>" . PHP_EOL;
            } else {
                $footer .= "  <script type=\"text/javascript\" src=\"$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/jquery.searcher.min.js\"></script>" . PHP_EOL;
            }
        }

        if ($options['general']['enable_viewer']) {
            $footer .= "  <script type=\"text/javascript\" src=\"$bootstrap_js\"></script>" . PHP_EOL;

            if($options['general']['enable_highlight'] == true) {
                 if ( ($options['general']['dependencies'] == 'cdn') && ($options['assets']['highlight_css']) && ($options['assets']['highlight_js']) ) {
                    $footer .= "  <script type=\"text/javascript\" src=\"".$options['assets']['highlight_js']."\"></script>" . PHP_EOL;
                } else {
                    $footer .= "  <script type=\"text/javascript\" src=\"$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/highlight.min.js\"></script>" . PHP_EOL;
                }
            }
        }
        
        $footer .= "  <script type=\"text/javascript\" src=\"$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/listr.min.js\"></script>" . PHP_EOL;
    }

    foreach($options['assets']['append_js'] as $append_js) {
        if ($append_js != null) {
            $footer .= "  <script type=\"text/javascript\" src=\"$append_js\"></script>" . PHP_EOL;
        }
    }

    if ($options['debug']['bootlint'] == true) {
        if ( ($options['general']['dependencies'] == 'cdn') && ($options['assets']['bootlint']) ){
            $bootlint = $options['assets']['bootlint'];
        } else {
            $bootlint = "$protocol".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/bootlint.js";
        }
        $footer .= "  <script type=\"text/javascript\" src=\"$bootlint\"></script>" . PHP_EOL;
    }

    return $footer;
}

function load_iconset($input = "glyphicon") {

    // Allow icon aliases
    if ( ($input === 'font-awesome') || ($input === 'fontawesome') ) {
        $input = "fa";
    } else if ( ($input === 'glyphicon') || ($input === 'glyph') ) {
        $input = "glyphicons";
    }

    // Does icon set exist?
    if( file_exists('themes/'.$input.'.json')) {
        $iconset = json_decode(file_get_contents('themes/'.$input.'.json'), true);
        return $iconset;
    } else {
        throw new Exception($input.'.json not found');
        break;
    }
}

function set_404_error() {
    header('HTTP/1.0 404 Not Found');
    echo "404 &mdash; Page not found";
}

function utf8ify($str) {
    if (is_file(!utf8_decode($str))) {
        return utf8_encode($str);
    } else {
        return $str;
    }
}

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
    $sort = null;
    foreach ($keys as $k)
    {
        if($i>0){$sort.=',';}
        $sort.='$cols['.$k['key'].']';
        if(isset($k['sort'])){$sort.=',SORT_'.strtoupper($k['sort']);}
        if(isset($k['type'])){$sort.=',SORT_'.strtoupper($k['type']);}
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
    $sizes = array(_('YB'), _('ZB'), _('EB'), _('PB'), _('TB'), _('GB'), _('MB'), _('KB'), _('bytes'));
    $total = count($sizes);
    while($total-- && $size > 1024) $size /= 1024;
    $return['num'] = round($size, $precision);
    $return['str'] = $sizes[$total];
    return $return;
}

/**
 *    @ http://css-tricks.com/snippets/php/time-ago-function/
 */
function time_ago($tm,$rcs = 0) {
    $cur_tm = time(); $dif = $cur_tm-$tm;
    $pds = array('second','minute','hour','day','week','month','year','decade');
    $lngh = array(1,60,3600,86400,604800,2630880,31570560,315705600);
    for($v = sizeof($lngh)-1; ($v >= 0)&&(($no = $dif/$lngh[$v])<=1); $v--); if($v < 0) $v = 0; $_tm = $cur_tm-($dif%$lngh[$v]);

    $no = floor($no); if($no <> 1) $pds[$v] .='s';
    $x=sprintf(_(sprintf('%%d %s ago', $pds[$v])), $no);
    if(($rcs == 1)&&($v >= 1)&&(($cur_tm-$_tm) > 0)) $x .= time_ago($_tm);
    return $x;
}

/**
 *    @ http://teddy.fr/2007/11/28/how-serve-big-files-through-php/
 */

// Read a file and display its content chunk by chunk
function readfile_chunked($filename, $retbytes = TRUE) {
    $chunksize = 1024*1024;
    $buffer = '';
    $count =0;
    // $handle = fopen($filename, 'rb');
    $handle = fopen($filename, 'rb');
    if ($handle === false) {
      return false;
    }
    while (!feof($handle)) {
      $buffer = fread($handle, $chunksize);
      echo $buffer;
      ob_flush();
      flush();
      if ($retbytes) {
        $count += strlen($buffer);
      }
    }
    $status = fclose($handle);
    if ($retbytes && $status) {
      return $count; // return num. bytes delivered like readfile() does.
    }
    return $status;
}

// Get protocol
// function get_protocol() {
//     if ($_SERVER['HTTPS']) {
//         return "https://";
//     } else {
//         return = "http://";
//     }
// }

?>