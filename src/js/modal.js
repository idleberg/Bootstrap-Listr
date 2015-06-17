// Assign variables
var viewer      = $("#viewer-modal");
var modal_body  = $(".modal-body");
var modal_title = $(".modal-title");
var file_meta   = $("#file-meta")
var full_view   = $(".fullview");
var btn         = full_view.data("button");
var dropbox     = $(".save-dropbox");
var email       = $(".email-link");
var twitter     = $(".twitter-link");
var facebook    = $(".facebook-link");
var google      = $(".google-link");

function set_modal(content, button, file, uri, meta) {
    
    // Inject content 
    modal_body.html(content);
    
    // Set meta
    full_view.attr("href", file);
    full_view.text(button);
    
    // Populate Dropbox drop-in
    dropbox.attr("href", file);
    
    // Populate share buttons
    email.attr("href", "mailto:?body=" + uri);
    twitter.attr("href", "http://twitter.com/share?url=" + uri);
    facebook.attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + uri);
    google.attr("href", "https://plus.google.com/share?url=" + uri);
    
    // Set title
    modal_title.text(decodeURIComponent(file));

    meta = typeof meta !== 'undefined' ? meta : null;
    file_meta.text(meta);
    
    // Show modal
    // viewer.modal("show");
}

$(".audio-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri  = $(this).get(0).href,
        meta = $(this).data("modified");
    
    set_modal('<audio src="' + file + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>', btn, file, uri, meta);
    viewer.modal("show");
});

$(".flash-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href,
        meta = $(this).data("modified");
    
    set_modal('<div class="viewer-wrapper"><object width="100%" height="100%" type="application/x-shockwave-flash" data="' + file + '"><param name="movie" value="' + file + '"><param name="quality" value="high"></object></div>', btn, file, uri, meta);
    viewer.modal("show");
});

$(".image-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href,
        meta = $(this).data("modified");

    set_modal('<img src="' + file + '"/>', btn, file, uri, meta);
    viewer.modal("show");
});

$(".video-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href,
        meta = $(this).data("modified");
    
    set_modal('<video src="' + file + '" id="player" autoplay controls>Video format or MIME type is not supported</video>', btn, file, uri, meta);
    viewer.modal("show");
});

$(".quicktime-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href,
        meta = $(this).data("modified");
    
    set_modal('<div class="viewer-wrapper"><embed width="100%" height="100%" src="' + file + '" type="video/quicktime" controller="true" showlogo="false" scale="aspect"></div>', btn, file, uri, meta);
    viewer.modal("show");
});

$(".source-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        data = $(this).data("highlight"),
        uri  = $(this).get(0).href,
        meta = $(this).data("modified");

    // Show & enable highlight button
    if (data !== true) {
        $(".highlight").removeClass("hidden").removeAttr("disabled");
    }

    // Get file extension
    var ext = file.split(".").pop();
    set_modal('<pre><code id="source" class="' + ext + '" dir="ltr"></code></pre>', btn, file, uri, meta);
    
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
    }).done(function( data ) {
        viewer.modal("show");
    });
});
    
$(".highlight").click(function(event) {
   
    event.preventDefault();
    
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

$(".text-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri = $(this).get(0).href,
        meta = $(this).data("modified");
    
    set_modal('<pre id="text"></pre>', btn, file, uri, meta);
    
    // Load file contents
    $.ajax(file, {
        dataType: "text",
        success: function(contents) {
            $("#text").text(decodeURIComponent(contents));
        }
    }).done(function( data ) {
        viewer.modal("show");
    });
});

viewer.on("hide.bs.modal", function() {
    
    var player = document.getElementById("player");
    
    if (player) {
        player.pause();
    }
});

viewer.on("hidden.bs.modal", function() {
    
    $(".highlight").addClass("hidden");
});

$(".website-modal").click(function(event) {
    
    event.preventDefault();
    
    var file = $(this).attr("href"),
        uri  = $(this).get(0).href,
        meta = $(this).data("modified");
    
    set_modal('<div class="viewer-wrapper"><iframe id="website" src="' + file + '" width="100%" height="100%" frameborder="0"></iframe></div>', btn, file, uri, meta);
    
    // Load file contents
    // $.ajax(file, {
    //     dataType: "html"
    // }).done(function( data ) {
    //     viewer.modal("show");
    // });

    viewer.modal("show");
});