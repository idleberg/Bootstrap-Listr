$(function() {
    function set_modal(content, button, file, uri) {
        $(".modal-body").empty().append(content);
        $(button).removeClass("hidden");
        $(".fullview").attr("href", file);
        $(".save-dropbox").attr("href", file);
        $(".email-link").attr("href", "mailto:?body=" + uri);
        $(".twitter-link").attr("href", "http://twitter.com/share?url=" + uri);
        $(".facebook-link").attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + uri);
        $(".google-link").attr("href", "https://plus.google.com/share?url=" + uri);
        $(".modal-title").text(decodeURIComponent(file));
        $("#viewer-modal").modal("show");
    }
    $(".audio-modal").click(function(e) {
        e.preventDefault();
        var file = $(this).attr("href"),
            uri = $(this).get(0).href;
        set_modal('<audio src="' + file + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>', ".btn-listen", file, uri);
    });
    $(".flash-modal").click(function(e) {
        e.preventDefault();
        var file = $(this).attr("href"),
            uri = $(this).get(0).href;
        set_modal('<div class="viewer-wrapper"><object width="100%" height="100%" type="application/x-shockwave-flash" data="' + file + '"><param name="movie" value="' + file + '"><param name="quality" value="high"></object></div>', ".btn-view", file, uri);
    });
    $(".image-modal").click(function(e) {
        e.preventDefault();
        var file = $(this).attr("href"),
            uri = $(this).get(0).href;
        set_modal('<img src="' + file + '"/>', ".btn-view", file, uri);
    });
    $(".video-modal").click(function(e) {
        e.preventDefault();
        var file = $(this).attr("href"),
            uri = $(this).get(0).href;
        set_modal('<video src="' + file + '" id="player" autoplay controls>Video format or MIME type is not supported</video>', ".btn-view", file, uri);
    });
    $(".quicktime-modal").click(function(e) {
        e.preventDefault();
        var file = $(this).attr("href"),
            uri = $(this).get(0).href;
        set_modal('<div class="viewer-wrapper"><embed width="100%" height="100%" src="' + file + '" type="video/quicktime" controller="true" showlogo="false" scale="aspect"></div>', ".btn-view", file, uri);
    });
    $(".source-modal").click(function(e) {
        e.preventDefault();
        $(".highlight").removeClass("hidden").removeAttr("disabled");
        var file = $(this).attr("href"),
            uri = $(this).get(0).href;
        var d = file.split(".").pop();
        set_modal('<pre><code id="source" class="' + d + '" dir="ltr"></code></pre>', ".btn-view", file, uri);
        $.ajax(file, {
            dataType: "text",
            success: function(contents) {
                $("#source").text(contents);
            }
        });
    });
    $(".highlight").click(function(c) {
        c.preventDefault();
        $(".highlight").attr("disabled", "disabled");
        $("#source").each(function(d, e) {
            hljs.highlightBlock(e);
        });
        var b = $("code").css("background-color");
        $("pre").css("background-color", b);
    });
    $("#viewer-modal").on("hide.bs.modal", function() {
        var b = document.getElementById("player");
        b && b.pause();
    });
    $("#viewer-modal").on("hidden.bs.modal", function() {
        $(".highlight,.btn-view,.btn-listen").addClass("hidden");
    });
    $(".save-dropbox").click(function(c) {
        c.preventDefault();
        var b = $(this).get(0).href;
        Dropbox.save(b);
    });
    $('#search').keyup(function(e){
        if(e.keyCode == 27) {
            $(this).val('');
        }
    });
    
    if(jQuery().stupidtable) {
      $("#bs-table").stupidtable();
    }
    if(jQuery().searcher) {
      $("#bs-table").searcher({
        inputSelector: "#search"
      });
    }
    
});