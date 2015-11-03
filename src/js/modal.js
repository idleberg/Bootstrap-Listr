// Assign variables
var viewer      = $("#viewer-modal");
var modal_body  = $(".modal-body");
var modal_title = $(".modal-title");
var file_meta   = $("#file-meta");
var full_view   = $(".fullview");
var button      = full_view.data("button");
var dropbox     = $(".save-dropbox");
var email       = $(".email-link");
var twitter     = $(".twitter-link");
var facebook    = $(".facebook-link");
var google      = $(".google-link");

function set_modal(content, file, uri, meta) {
    
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
}

function set_vmodal(content, file, name, uri) {
    
    // Inject content 
    modal_body.html(content);
    
    // Set meta
    full_view.attr("href", uri);
    full_view.text(button);
    
    // Populate Dropbox drop-in
    dropbox.attr("href", file);
    
    // Populate share buttons
    email.attr("href", "mailto:?body=" + encodeURIComponent(name) + "%20" + uri);
    twitter.attr("href", "http://twitter.com/share?text=" + encodeURIComponent(name) + "&amp;url=" + uri);
    facebook.attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + uri);
    google.attr("href", "https://plus.google.com/share?url=" + uri);
    
    // Set title
    modal_title.text(name);

    // file_meta.html('<a href="' + uri + '" class="text-muted" title="' + name + '">' + uri + '</a>');
    file_meta.html(uri);
}

// Default actions for each modal
function modal_defaults(ev, el) {
    // prevent from loading link
    ev.preventDefault();

    var file = el.attr("href"),
        uri  = el.get(0).href,
        meta = el.data("modified");

    return [file, uri, meta];
}

function source_defaults( ev, el) {
    var arr = modal_defaults( ev, el );
    var data = el.data("highlight");

    // Show & enable highlight button
    if (data !== true) {
        $(".highlight").removeClass("hidden").removeAttr("disabled");
    }

    // Get file extension
    var ext = arr[0].split(".").pop();

    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<pre><code id="source" class="' + ext + '" dir="ltr"></code></pre>', arr[0], arr[1], arr[2]);

    return [arr[0], data];
}

$(".audio-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );
    
    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<audio src="' + arr[0] + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>', arr[0], arr[1], arr[2]);

    // show modal
    viewer.modal("show");
});

$(".flash-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );
    
    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<div class="embed-responsive embed-responsive-4by3"><object class="embed-responsive-item" type="application/x-shockwave-flash" data="' + arr[0] + '"><param name="movie" value="' + arr[0] + '"><param name="quality" value="high"></object></div>', arr[0], arr[1], arr[2]);
    
    // show modal
    viewer.modal("show");
});

$(".image-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );

    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<img src="' + arr[0] + '"/>', arr[0], arr[1], arr[2]);

    // show modal
    viewer.modal("show");
});

$(".pdf-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );

    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" src="' + arr[0] + '" type="application/pdf" scale="aspect" frameborder="0"></iframe></div>', arr[0], arr[1], arr[2]);
    
    // show modal
    viewer.modal("show");
});

$(".video-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );

    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<video src="' + arr[0] + '" id="player" autoplay controls>Video format or MIME type is not supported</video>', arr[0], arr[1], arr[2]);
    
    // show modal
    viewer.modal("show");
});

$(".virtual-modal").click(function(event) {
    
    // prevent from loading link
    event.preventDefault();

    if (typeof $(this).data('vimeo') !== 'undefined') {
        file = $(this).html();
        id   = $(this).data("vimeo");
        name = $(this).data("name");
        uri  = $(this).data("url");
        set_vmodal('<div class="embed-responsive embed-responsive-16by9"><iframe id="virtual" class="embed-responsive-item" src="https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" allowfullscreen>Video format or MIME type is not supported</iframe></div>', file, name, uri);
        viewer.modal("show");
    } else if (typeof $(this).data('youtube') !== 'undefined') {
        file = $(this).html();
        id   = $(this).data("youtube");
        name = $(this).data("name");
        uri  = $(this).data("url");
        set_vmodal('<div class="embed-responsive embed-responsive-16by9"><iframe id="virtual" class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&amp;rel=0&amp;showinfo=0" frameborder="0" allowfullscreen>Video format or MIME type is not supported</iframe></div>', file, name, uri);
        viewer.modal("show");
    } else if (typeof $(this).data('flickr') !== 'undefined') {
        file = $(this).html();
        id   = $(this).data("flickr");
        name = $(this).data("name");
        uri  = $(this).data("url");
        set_vmodal('<div class="embed-responsive embed-responsive-1by1"><iframe id="virtual" class="embed-responsive-item" src="https://www.flickr.com/photos/' + id + '/player/" scrolling="no" frameborder="0" allowfullscreen></iframe></div>', file, name, uri);
        viewer.modal("show");
    } else if (typeof $(this).data('soundcloud') !== 'undefined') {
        file = $(this).html();
        id   = $(this).data("soundcloud");
        name = $(this).data("name");
        uri  = $(this).data("url");
        set_vmodal('<div class="embed-responsive embed-responsive-4by3"><iframe id="virtual" class="embed-responsive-item" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/' + id + '&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe></div>', file, name, uri);
        viewer.modal("show");
    }

    // var file = el.attr("href"),
    //     uri  = el.get(0).href,
    //     meta = el.data("modified");

    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    // <iframe src="https://player.vimeo.com/video/65630550?autoplay=1&title=0&byline=0&portrait=0" width="848" height="477" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    
});

$(".quicktime-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );

    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<div class="embed-responsive embed-responsive-16by9"><embed class="embed-responsive-item" src="' + arr[0] + '" type="video/quicktime" controller="true" showlogo="false" scale="aspect"></div>', arr[0], arr[1], arr[2]);
    
    // show modal
    viewer.modal("show");
});

$(".source-modal").click(function(event) {
    
    arr = source_defaults( event, $(this) );
    
    // Load file contents
    $.ajax(arr[0], {
        dataType: "text",
        success: function(contents) {
            // Inject source code
            $("#source").text(decodeURIComponent(contents));
            
            // Fire auto-highlighter
            if (arr[1] === true) {
                $("#source").each(function(i, block) {
                    if(typeof(hljs) !== 'undefined') hljs.highlightBlock(block);
                    // adjust pre background-color
                    var background = $("code").css("background-color");
                    $("pre").css("background-color", background);
                });
            }
        }
    }).done(function() {
        // show modal
        viewer.modal("show");
    });
});

$(".source-modal-alt").click(function(event) {
    
    arr = source_defaults( event, $(this) );
    
    // Load file contents
    $.ajax(arr[0], {
        dataType: "text",
        success: function(contents) {
            // Inject source code
            $("#source").text(decodeURIComponent(contents));
            
            // Fire auto-highlighter
            if (arr[1] === true) {
                $("#source").each(function(i, block) {
                    hljs.highlightBlock(block);
                    // adjust pre background-color
                    var background = $("code").css("background-color");
                    $("pre").css("background-color", background);
                });
            }
        }
    });

    // show modal
    viewer.modal("show");
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
    
     var arr = modal_defaults( event, $(this) );
    
    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<pre><code id="text"></code></pre>', arr[0], arr[1], arr[2]);
    
    // Load file contents
    $.ajax(arr[0], {
        dataType: "text",
        success: function(contents) {
            $("#text").text(decodeURIComponent(contents));
        }
    }).done(function() {
        // show modal
        viewer.modal("show");
    });
});

$(".text-modal-alt").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );
    
    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<pre><code id="text"></code></pre>', arr[0], arr[1], arr[2]);
    
    // Load file contents
    $.ajax(arr[0], {
        dataType: "text",
        success: function(contents) {
            $("#text").text(decodeURIComponent(contents));
        }
    });
    // show modal
    viewer.modal("show");
});

viewer.on("hide.bs.modal", function() {
    
    // Stop HTML5 player
    var player = document.getElementById("player");
    
    if (player) {
        player.pause();
        player.src = "";
    }

});

viewer.on("hidden.bs.modal", function() {
    
    // hide Highlighter button
    $(".highlight").addClass("hidden");

    // Empty modal body to stop playback in Firefox
    $(".modal-body").empty();
});

$(".website-modal").click(function(event) {
    
     var arr = modal_defaults( event, $(this) );
    
    // arr[0] = file name
    // arr[1] = file uri
    // arr[2] = file meta
    set_modal('<div class="embed-responsive embed-responsive-4by3"><iframe id="website" class="embed-responsive-item" src="' + arr[0] + '" sandbox frameborder="0"></iframe></div>', arr[0], arr[1], arr[2]);

    viewer.modal("show");
});