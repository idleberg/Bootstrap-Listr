$(function() {
    function a(e, b, d, c) {
        $(".modal-body").empty().append(e);
        $(".fullview").attr("href", d).text(b);
        $(".save-dropbox").attr("href", d);
        $(".email-link").attr("href", "mailto:?body=" + c);
        $(".twitter-link").attr("href", "http://twitter.com/share?url=" + c);
        $(".facebook-link").attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + c);
        $(".google-link").attr("href", "https://plus.google.com/share?url=" + c);
        $(".modal-title").text(decodeURIComponent(d));
        $("#viewer-modal").modal("show")
    }
    $(".audio-modal").click(function(d) {
        d.preventDefault();
        var c = $(this).attr("href"),
            b = $(this).get(0).href;
        a('<audio src="' + c + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>', "Listen", c, b)
    });
    $(".flash-modal").click(function(d) {
        d.preventDefault();
        var c = $(this).attr("href"),
            b = $(this).get(0).href;
        a('<div class="viewer-wrapper"><object width="100%" height="100%" type="application/x-shockwave-flash" data="' + c + '"><param name="movie" value="' + c + '"><param name="quality" value="high"></object></div>', "View", c, b)
    });
    $(".image-modal").click(function(d) {
        d.preventDefault();
        var c = $(this).attr("href"),
            b = $(this).get(0).href;
        a('<img src="' + c + '"/>', "View", c, b)
    });
    $(".video-modal").click(function(d) {
        d.preventDefault();
        var c = $(this).attr("href"),
            b = $(this).get(0).href;
        a('<video src="' + c + '" id="player" autoplay controls>Video format or MIME type is not supported</video>', "View", c, b)
    });
    $(".quicktime-modal").click(function(d) {
        d.preventDefault();
        var c = $(this).attr("href"),
            b = $(this).get(0).href;
        a('<div class="viewer-wrapper"><embed width="100%" height="100%" src="' + c + '" type="video/quicktime" controller="true" showlogo="false" scale="aspect"></div>', "View", c, b)
    });
    $(".source-modal").click(function(f) {
        f.preventDefault();
        $(".highlight").removeClass("hidden").removeAttr("disabled");
        var c = $(this).attr("href"),
            b = $(this).get(0).href;
        var d = c.split(".").pop();
        a('<pre><code id="source" class="' + d + '"></code></pre>', "View", c, b);
        $.ajax(c, {
            dataType: "text",
            success: function(e) {
                $("#source").text(e)
            }
        })
    });
    $(".highlight").click(function(c) {
        c.preventDefault();
        $(".highlight").attr("disabled", "disabled");
        $("#source").each(function(d, e) {
            hljs.highlightBlock(e)
        });
        var b = $("code").css("background-color");
        $("pre").css("background-color", b)
    });
    $("#viewer-modal").on("hide.bs.modal", function() {
        var b = document.getElementById("player");
        b && b.pause();
        $(".highlight").addClass("hidden")
    });
    $(".save-dropbox").click(function(c) {
        c.preventDefault();
        var b = $(this).get(0).href;
        Dropbox.save(b)
    })
    $("#bs-table").stupidtable()
});