<?php
/*** FUNCTIONS ***/

function set_bootstrap_theme() {
    if (CUSTOM_THEME) {
        return CUSTOM_THEME;
    } else {
        $cdn_pre = '//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/';
        $cdn_post = '/bootstrap.min.css';
        $bootswatch = array('amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti');

        if (in_array(BOOTSTRAP_THEME, $bootswatch)) {
            return '//maxcdn.bootstrapcdn.com/bootswatch/3.2.0/'.BOOTSTRAP_THEME.'/bootstrap.min.css';
        } else {
            return '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css';
        }
    }
}

// Set header
function set_header($theme) {

    $header = "  <meta charset=\"utf-8\">" . PHP_EOL;
    $header = $header."  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=yes\">" . PHP_EOL;
    $header = $header."  <meta name=\"generator\" content=\"Bootstrap Listr\" />" . PHP_EOL;
    $header = $header."  <title>Index of ".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."</title>" . PHP_EOL;

    if (FAV_ICON) $header = $header."  <link rel=\"shortcut icon\" href=\"".FAV_ICON."\" />" . PHP_EOL;
    if (IPHONE_ICON) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"57x57\" href=\"".IPHONE_ICON."\" />" . PHP_EOL;
    if (IPHONE_ICON_RETINA) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\"".IPHONE_ICON_RETINA."\" />" . PHP_EOL;
    if (IPAD_ICON) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\"".IPAD_ICON."\" />" . PHP_EOL;
    if (IPAD_ICON_RETINA) $header = $header."  <link rel=\"apple-touch-icon\" sizes=\"144x144\" href=\"".IPAD_ICON_RETINA."\" />" . PHP_EOL;
    if (METRO_TILE_COLOR) $header = $header."  <meta name=\"msapplication-TileColor\" content=\"#".METRO_TILE_COLOR."\" />" . PHP_EOL;
    if (METRO_TILE_IMAGE) $header = $header."  <meta name=\"msapplication-TileImage\" content=\"#".METRO_TILE_IMAGE."\" />" . PHP_EOL;
    if (OG_TITLE) $header = $header."  <meta property=\"og:title\" content=\"".OG_TITLE."\" />" . PHP_EOL;
    if (OG_DESCRIPTION) $header = $header."  <meta property=\"og:description\" content=\"".OG_DESCRIPTION."\" />" . PHP_EOL;
    if (OG_SITE_NAME) $header = $header."  <meta property=\"og:site_name\" content=\"".OG_SITE_NAME."\" />" . PHP_EOL;
    if (OG_LOCALE) $header = $header."  <meta property=\"og:locale\" content=\"".OG_LOCALE."\" />" . PHP_EOL;
    if (OG_TYPE) $header = $header."  <meta property=\"og:type\" content=\"".OG_TYPE."\" />" . PHP_EOL;
    if (OG_IMAGE) $header = $header."  <meta property=\"og:image\" content=\"".OG_IMAGE."\" />" . PHP_EOL;
    $header = $header."  <link rel=\"stylesheet\" href=\"$theme\" />" . PHP_EOL;

    if (ERROR_PAGE) {
        if (DOC_ICONS == "fontawesome") {
            $header = $header."  <link rel=\"stylesheet\" href=\"".FONT_AWESOME."\" />" . PHP_EOL;
        }

        if (ENABLE_VIEWER) {
            $modal_css = ".modal img{display:block;margin:0 auto;max-width:100%}.modal video,.modal audio{width:100%}.viewer-wrapper{position:relative;padding-bottom:56.25%;height:0}.viewer-wrapper embed,.viewer-wrapper object{position:absolute;top:0;left:0;width:100%;height:100%}";

            if ((HIGHLIGHTER_CSS) && (HIGHLIGHTER_JS)) {
                $header = $header."  <link rel=\"stylesheet\" href=\"".HIGHLIGHTER_CSS."\" />" . PHP_EOL;
            }
        }

        $header = $header."  <style type=\"text/css\">th{cursor:pointer}".$modal_css."</style>" . PHP_EOL;
    }

    if (GOOGLE_FONT) {
        $header = $header."  <link href=\"//fonts.googleapis.com/css?family=".GOOGLE_FONT."\" rel=\"stylesheet\" type=\"text/css\">" . PHP_EOL;
    }

    return $header;

}

// Set HTML footer
function set_footer(){
    if (ERROR_PAGE) {

        if ( (ENABLE_SORT) || (ENABLE_VIEWER) ) {
            $footer = $footer."  <script type=\"text/javascript\" src=\"".JQUERY."\"></script>" . PHP_EOL;
        }

        if (ENABLE_VIEWER) {
            $footer = $footer."  <script type=\"text/javascript\" src=\"".BOOTSTRAP_JS."\"></script>" . PHP_EOL;
            
            if( (SHARE_BUTTON) && (DROPBOX_KEY) ){
                $footer = $footer."  <script type=\"text/javascript\" src=\"//www.dropbox.com/static/api/2/dropins.js\" id=\"dropboxjs\" data-app-key=\"nzeq1welehd2rug\"></script>" . PHP_EOL;
            }
            $footer = $footer."  <script type=\"text/javascript\">$(function(){function a(e,b,d,c){\$(\".modal-body\").empty().append(e);$(\".fullview\").attr(\"href\",d).text(b);$(\".save-dropbox\").attr(\"href\",d);$(\".email-link\").attr(\"href\",\"mailto:?body=\"+c);$(\".twitter-link\").attr(\"href\",\"http://twitter.com/share?url=\"+c);$(\".facebook-link\").attr(\"href\",\"http://www.facebook.com/sharer/sharer.php?u=\"+c);$(\".google-link\").attr(\"href\",\"https://plus.google.com/share?url=\"+c);$(\".modal-title\").text(decodeURIComponent(d));$(\"#viewer-modal\").modal(\"show\")}$(\".audio-modal\").click(function(d){d.preventDefault();var c=$(this).attr(\"href\"),b=$(this).get(0).href;a('<audio src=\"'+c+'\" id=\"player\" autoplay controls>Your browser does not support the audio element.</audio>',\"Listen\",c,b)});$(\".flash-modal\").click(function(d){d.preventDefault();var c=$(this).attr(\"href\"),b=$(this).get(0).href;a('<div class=\"viewer-wrapper\"><object width=\"100%\" height=\"100%\" type=\"application/x-shockwave-flash\" data=\"'+c+'\"><param name=\"movie\" value=\"'+c+'\"><param name=\"quality\" value=\"high\"></object></div>',\"View\",c,b)});$(\".image-modal\").click(function(d){d.preventDefault();var c=$(this).attr(\"href\"),b=$(this).get(0).href;a('<img src=\"'+c+'\"/>',\"View\",c,b)});$(\".video-modal\").click(function(d){d.preventDefault();var c=$(this).attr(\"href\"),b=$(this).get(0).href;a('<video src=\"'+c+'\" id=\"player\" autoplay controls>Video format or MIME type is not supported</video>',\"View\",c,b)});$(\".quicktime-modal\").click(function(d){d.preventDefault();var c=$(this).attr(\"href\"),b=$(this).get(0).href;a('<div class=\"viewer-wrapper\"><embed width=\"100%\" height=\"100%\" src=\"'+c+'\" type=\"video/quicktime\" controller=\"true\" showlogo=\"false\" scale=\"aspect\"></div>',\"View\",c,b)});$(\".source-modal\").click(function(f){f.preventDefault();$(\".highlight\").removeClass(\"hidden\").removeAttr(\"disabled\");var c=$(this).attr(\"href\"),b=$(this).get(0).href;var d=c.split(\".\").pop();a('<pre><code id=\"source\" class=\"'+d+'\"></code></pre>',\"View\",c,b);$.ajax(c,{dataType:\"text\",success:function(e){\$(\"#source\").text(e)}})});$(\".highlight\").click(function(c){c.preventDefault();$(\".highlight\").attr(\"disabled\",\"disabled\");$(\"#source\").each(function(d,e){hljs.highlightBlock(e)});var b=$(\"code\").css(\"background-color\");$(\"pre\").css(\"background-color\",b)});$(\"#viewer-modal\").on(\"hide.bs.modal\",function(){var b=document.getElementById(\"player\");b&&b.pause();$(\".highlight\").addClass(\"hidden\")});$(\".save-dropbox\").click(function(c){c.preventDefault();var b=$(this).get(0).href;Dropbox.save(b)})});</script>" . PHP_EOL;
            
            if( (HIGHLIGHTER_JS) && (HIGHLIGHTER_CSS) ){
                $footer = $footer."  <script type=\"text/javascript\" src=\"".HIGHLIGHTER_JS."\"></script>" . PHP_EOL;
            }
        }

        if ((ENABLE_SORT) && (STUPIDTABLE)) {
            $footer = $footer."  <script type=\"text/javascript\" src=\"".STUPIDTABLE."\"></script>" . PHP_EOL;
            $footer = $footer."  <script type=\"text/javascript\">$(\"#bs-table\").stupidtable()</script>" . PHP_EOL;
        }
    }

    if (ANALYTICS_ID) {
        $footer = $footer."  <script type=\"text/javascript\">var _gaq=_gaq||[];_gaq.push([\"_setAccount\",\"".ANALYTICS_ID."\"]);_gaq.push([\"_trackPageview\"]);(function(){var ga=document.createElement(\"script\");ga.type=\"text/javascript\";ga.async=true;ga.src=(\"https:\"==document.location.protocol?\"https://ssl\":\"http://www\")+\".google-analytics.com/ga.js\";var s=document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(ga,s)})();</script>" . PHP_EOL;
    }

    return $footer;
}

function set_404_error() {
    header('HTTP/1.0 404 Not Found');
    echo "404 &mdash; Page not found";
    // header( 'Location: ./listr-404.php' );
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
?>