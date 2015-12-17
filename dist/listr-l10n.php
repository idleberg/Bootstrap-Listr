<?php

session_start();

if ($options['general']['locale']) {
    $locale = $options['general']['locale'];
} else if (isset($_GET["locale"])) {
    $locale = $_GET["l10n"];
} else if (isset($_SESSION["l10n"])) {
    $locale = $_SESSION["l10n"];
} else {
    $locale = "en_US";
}

putenv("LANG=" . $locale);
setlocale(LC_ALL, $locale);

$domain = "messages";
bindtextdomain($domain, "l10n");
bind_textdomain_codeset($domain, 'UTF-8');

textdomain($domain);

session_write_close();

?>