<?php

session_start();

if ($options['general']['locale']) {
    $locale = $options['general']['locale'];
} else if (isset($_GET["locale"])) {
    $locale = $_GET["locale"];
} else if (isset($_SESSION["locale"])) {
    $locale = $_SESSION["locale"];
} else {
    $locale = "en_US";
}

putenv("LANG=" . $locale);
setlocale(LC_ALL, $locale);

$domain = "messages";
bindtextdomain($domain, "locale");
bind_textdomain_codeset($domain, 'UTF-8');

textdomain($domain);

?>