<?php
/*** FUNCTIONS ***/

function set_bootstrap_theme() {

    global $options;
    
    if ($options['cdn']['custom_theme']) {
        return $options['cdn']['custom_theme'];
    } else {
        $cdn_pre = '//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/';
        $cdn_post = '/bootstrap.min.css';
        $bootswatch = array('amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti');
        $m8tro = array('m8tro-aqua','m8tro-blue','m8tro-brown','m8tro-green','m8tro-orange','m8tro-purple','m8tro-red','m8tro-yellow');

        if (in_array($options['bootstrap']['theme'], $bootswatch)) {
            return '//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/'.$options['bootstrap']['theme'].'/bootstrap.min.css';
        } else if (in_array($options['bootstrap']['theme'], $m8tro)) {
            return '//idleberg.github.io/m8tro-listr/'.$options['bootstrap']['theme'].'.min.css';
        } else {
            return '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css';
        }
    }
}

// Set header
function set_header($theme) {

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

    if ($options['general']['dependencies'] == 'cdn') {
        $bootstrap_css   = $theme;
        $fontawesome_css = $options['cdn']['font_awesome'];
    } else {
        $bootstrap_css   = "//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/bootstrap.min.css";
        $fontawesome_css = "//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/font-awesome.min.css";
    }

    if ($options['icons']['fav_icon']) $header .= "  <link rel=\"shortcut icon\" href=\"".$options['icons']['fav_icon']."\" />" . PHP_EOL;
    if ($options['icons']['iphone']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"57x57\" href=\"".$options['icons']['iphone']."\" />" . PHP_EOL;
    if ($options['icons']['iphone_retina']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\"".$options['icons']['iphone_retina']."\" />" . PHP_EOL;
    if ($options['icons']['ipad']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\"".$options['icons']['ipad']."\" />" . PHP_EOL;
    if ($options['icons']['ipad_retina']) $header .= "  <link rel=\"apple-touch-icon\" sizes=\"144x144\" href=\"".$options['icons']['ipad_retina']."\" />" . PHP_EOL;
    if ($options['icons']['metro_tile_color']) $header .= "  <meta name=\"msapplication-TileColor\" content=\"#".$options['icons']['metro_tile_color']."\" />" . PHP_EOL;
    if ($options['icons']['metro_tile_image']) $header .= "  <meta name=\"msapplication-TileImage\" content=\"#".$options['icons']['metro_tile_image']."\" />" . PHP_EOL;
    if ($options['opengraph']['title']) $header .= "  <meta property=\"og:title\" content=\"".$options['opengraph']['title']."\" />" . PHP_EOL;
    if ($options['opengraph']['description']) $header .= "  <meta property=\"og:description\" content=\"".$options['opengraph']['description']."\" />" . PHP_EOL;
    if ($options['opengraph']['site_name']) $header .= "  <meta property=\"og:site_name\" content=\"".$options['opengraph']['site_name']."\" />" . PHP_EOL;

    $header .= "  <link rel=\"stylesheet\" href=\"$bootstrap_css\" />" . PHP_EOL;

    if ($fontawesome_css) {
        $header .= "  <link rel=\"stylesheet\" href=\"$fontawesome_css\" />" . PHP_EOL;
    }

    if ($options['general']['enable_viewer']) {    

        if (($options['cdn']['highlight_css']) && ($options['cdn']['highlight_js'])) {
            if ($options['general']['dependencies'] == 'cdn') {
                $header .= "  <link rel=\"stylesheet\" href=\"".$options['cdn']['highlight_css']."\" />" . PHP_EOL;
            } else {
                $header .= "  <link rel=\"stylesheet\" href=\"//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/highlight.min.css\" />" . PHP_EOL;
            }
        }
    }

    $header .= "  <link rel=\"stylesheet\" href=\"//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/css/listr.min.css\" />" . PHP_EOL;

    if ($options['cdn']['google_font']) {
        $header .= "  <link href=\"".$options['cdn']['google_font']."\" rel=\"stylesheet\" type=\"text/css\">" . PHP_EOL;
    }

    return $header;

}

// Set HTML footer
function set_footer(){

    $footer = null;
    global $options;

    if ($options['general']['dependencies'] == 'cdn') {
        $jquery_js    = $options['cdn']['jquery'];
        $bootstrap_js = $options['cdn']['bootstrap'];
    } else {
        $jquery_js    = "//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/jquery.min.js";
        $bootstrap_js = "//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/bootstrap.min.js";
    }

    if ( ($options['general']['enable_sort']) || ($options['general']['enable_viewer']) ) {
        $footer .= "  <script type=\"text/javascript\" src=\"$jquery_js\"></script>" . PHP_EOL;
    }

    if (($options['general']['enable_sort']) && ($options['cdn']['stupid_table'])) {
        $footer .= "  <script type=\"text/javascript\" src=\"".$options['cdn']['stupid_table']."\"></script>" . PHP_EOL;
    }

    if ($options['general']['enable_search'] == true) {
      $footer .= "  <script type=\"text/javascript\" src=\"//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/jquery.searcher.min.js\"></script>" . PHP_EOL;
    }

    if ($options['general']['enable_viewer']) {
        $footer .= "  <script type=\"text/javascript\" src=\"$bootstrap_js\"></script>" . PHP_EOL;
        
        if( ($options['general']['share_button']) && ($options['keys']['dropbox_app']) ){
            $footer .= "  <script type=\"text/javascript\" src=\"//www.dropbox.com/static/api/2/dropins.js\" id=\"dropboxjs\" data-app-key=\"nzeq1welehd2rug\"></script>" . PHP_EOL;
        }

        if( ($options['cdn']['highlight_js']) && ($options['cdn']['highlight_css']) ){
             if ($options['general']['dependencies'] == 'cdn') {
                $footer .= "  <script type=\"text/javascript\" src=\"".$options['cdn']['highlight_js']."\"></script>" . PHP_EOL;
            } else {
                $footer .= "  <script type=\"text/javascript\" src=\"//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/highlight.min.js\"></script>" . PHP_EOL;
            }
        }

        $footer .= "  <script type=\"text/javascript\" src=\"//".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."/assets/js/listr.min.js\"></script>" . PHP_EOL;

    }

    if ($options['keys']['google_analytics']) {
        $footer .= "  <script type=\"text/javascript\">var _gaq=_gaq||[];_gaq.push([\"_setAccount\",\"".$options['keys']['google_analytics']."\"]);_gaq.push([\"_trackPageview\"]);(function(){var ga=document.createElement(\"script\");ga.type=\"text/javascript\";ga.async=true;ga.src=(\"https:\"==document.location.protocol?\"https://ssl\":\"http://www\")+\".google-analytics.com/ga.js\";var s=document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(ga,s)})();</script>" . PHP_EOL;
    }

    return $footer;
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
?>