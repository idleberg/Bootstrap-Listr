function set_modal(content, button, file, uri) {
    
    // Inject content 
    $(".modal-body").empty().append(content);
    
    // Set meta
    $(".fullview").attr("href", file);
    $(".fullview").text(button);
    
    // Populate Dropbox drop-in
    $(".save-dropbox").attr("href", file);
    
    // Populate share buttons
    $(".email-link").attr("href", "mailto:?body=" + uri);
    $(".twitter-link").attr("href", "http://twitter.com/share?url=" + uri);
    $(".facebook-link").attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + uri);
    $(".google-link").attr("href", "https://plus.google.com/share?url=" + uri);
    
    $(".modal-title").text(decodeURIComponent(file));
    
    // Show modal
    $("#viewer-modal").modal("show");
}

btn = $(".fullview").data("button");

$(".audio-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri  = $(this).get(0).href;
    
    set_modal('<audio src="' + file + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>', btn, file, uri);
});

$(".flash-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href;
    
    set_modal('<div class="viewer-wrapper"><object width="100%" height="100%" type="application/x-shockwave-flash" data="' + file + '"><param name="movie" value="' + file + '"><param name="quality" value="high"></object></div>', btn, file, uri);
});

$(".image-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href;
    
    set_modal('<img src="' + file + '"/>', btn, file, uri);
});

$(".video-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href;
    
    set_modal('<video src="' + file + '" id="player" autoplay controls>Video format or MIME type is not supported</video>', btn, file, uri);
});

$(".quicktime-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href;
    
    set_modal('<div class="viewer-wrapper"><embed width="100%" height="100%" src="' + file + '" type="video/quicktime" controller="true" showlogo="false" scale="aspect"></div>', btn, file, uri);
});

$(".source-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        data = $(this).data("highlight"),
        uri  = $(this).get(0).href;

    // Show & enable highlight button
    if (data !== true) {
        $(".highlight").removeClass("hidden").removeAttr("disabled");
    }

    // Get file extension
    var ext = file.split(".").pop();
    set_modal('<pre><code id="source" class="' + ext + '" dir="ltr"></code></pre>', btn, file, uri);
    
    // Load file contents
    $.ajax(file, {
        dataType: "text",
        success: function(contents) {
            // Inject source code
            $("#source").text(decodeURIComponent(contents));
            
            // Fire auto-highlighter
            if (data === true) {
                $("#source").each(function(i, block) {
                    hljs.highlightBlock(block);
                });
            }
        }
    });
});
    
$(".highlight").click(function(c) {
   
    c.preventDefault();
    
    // Disable highlight button
    $(".highlight").attr("disabled", "disabled");

    // Fire highlighter
    $("#source").each(function(i, block) {
        hljs.highlightBlock(block);
    });

    // Adapt pre background-color from highlighter.js theme
    var background = $("code").css("background-color");
    $("pre").css("background-color", background);
});

$(".text-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href;
    
    set_modal('<pre><code id="text" dir="ltr"></code></pre>', btn, file, uri);
    
    // Load file contents
    $.ajax(file, {
        dataType: "text",
        success: function(contents) {
            $("#text").text(decodeURIComponent(contents));
        }
    });
});

$("#viewer-modal").on("hide.bs.modal", function() {
    
    var player = document.getElementById("player");
    
    if (player) {
        player.pause();
    }
});

$("#viewer-modal").on("hidden.bs.modal", function() {
    
    $(".highlight").addClass("hidden");
});

$(".website-modal").click(function(e) {
    
    e.preventDefault();
    
    var file = $(this).attr("href"),
        uri  = $(this).get(0).href;
    
    set_modal('<div class="viewer-wrapper"><iframe id="website" src="' + file + '" width="100%" height="100%" frameborder="0"></iframe></div>', btn, file, uri);
    
    // Load file contents
    $.ajax(file, {
        dataType: "html"
    });
});