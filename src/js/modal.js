var M,
Modal = {


  // audio
  // <audio src="' + arr[0] + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>

  // img
  // <img src="' + arr[0] + '"/>

  // video
  // <video src="' + arr[0] + '" id="player" autoplay controls>Video format or MIME type is not supported</video>

  // text
  // <pre><code id="text"></code></pre>

  // source
  // <pre><code id="source" class="' + ext + '" dir="ltr"></code></pre>

  // flash
  // <div class="embed-responsive embed-responsive-4by3">
  //  <object class="embed-responsive-item" type="application/x-shockwave-flash" data="' + arr[0] + '">
  //    <param name="movie" value="' + arr[0] + '">
  //    <param name="quality" value="high">
  //  </object>
  // </div>

  // website
  // <div class="embed-responsive embed-responsive-4by3">
  //   <iframe id="website" class="embed-responsive-item" src="' + arr[0] + '" sandbox frameborder="0"></iframe>
  // </div>

  // pdf
  // <div class="embed-responsive embed-responsive-4by3">
  //   <iframe class="embed-responsive-item" src="' + arr[0] + '" type="application/pdf" scale="aspect" frameborder="0"></iframe>
  // </div>

  // quicktime
  // <div class="embed-responsive embed-responsive-16by9">
  //   <embed class="embed-responsive-item" src="' + arr[0] + '" type="video/quicktime" controller="true" showlogo="false" scale="aspect">
  // </div>

  // virtual
  // <div class="embed-responsive embed-responsive-16by9"><iframe id="virtual" class="embed-responsive-item" src="https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" allowfullscreen>Video format or MIME type is not supported</iframe></div>
  // <div class="embed-responsive embed-responsive-16by9"><iframe id="virtual" class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&amp;rel=0&amp;showinfo=0" frameborder="0" allowfullscreen>Video format or MIME type is not supported</iframe></div>
  // <div class="embed-responsive embed-responsive-1by1"><iframe id="virtual" class="embed-responsive-item" src="https://www.flickr.com/photos/' + id + '/player/" scrolling="no" frameborder="0" allowfullscreen></iframe></div>
  // <div class="embed-responsive embed-responsive-4by3"><iframe id="virtual" class="embed-responsive-item" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/' + id + '&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe></div>

  elements: {
    viewer: $("#viewer-modal"),
    modal_body: $(".modal-body"),
    modal_title: $(".modal-title"),
    file_meta: $("#file-meta"),
    full_view: $(".fullview"),
    button: $(".fullview").data("button"),
    dropbox: $(".save-dropbox"),
    email: $(".email-link"),
    twitter: $(".twitter-link"),
    facebook: $(".facebook-link"),
    google: $(".google-link"),
    textModal: $(".text-modal"),
    sourceModal: $(".source-modal"),
  },

  init: function() {
      M = this.elements;
      this.events();
  },

  events: function() {
    $('#viewer-modal').on('show.bs.modal', function (e) {
      var el = $(e.relatedTarget);     

      var type = el.data("type");

      if (type === 'text') {
        Modal.setTextModal(el);
      } else if (type === 'source') {
        Modal.setSourceModal(el);
      } else if (type === 'audio') {
        Modal.setAudioModal(el);
      } else if (type === 'video') {
        Modal.setVideoModal(el);
      } else if (type === 'image') {
        Modal.setImageModal(el);
      } else if (type === 'website') {
        Modal.setWebModal(el);
      }
    });

    $(M.viewer).on("hide.bs.modal", function() {
      Modal.stopPlayer();
    });

    $(M.viewer).on("hidden.bs.modal", function() {
      Modal.reset();
    });
  },

    setAudioModal: function(el) {
        var modal = {
            open:      '<pre><code id="text">',
            close:      '</code></pre>',
            file:      el.attr("href"),
            uri:       el.get(0).href,
            size:      el.data("size"),
       };
       M.modal_body.html('<audio src="' + modal.file + '" id="player" autoplay controls>Your browser does not support the audio element.</audio>');
       
       Modal.setMeta(modal);
       M.viewer.modal("show");
    },

    setVideoModal: function(el) {
        var modal = {
            file:      el.attr("href"),
            uri:       el.get(0).href,
            size:      el.data("size"),
       };
       M.modal_body.html('<video src="' + modal.file + '" id="player" autoplay controls>Video format or MIME type is not supported</video>');
       
       Modal.setMeta(modal);
       M.viewer.modal("show");
    },

    setImageModal: function(el) {
        var modal = {
            file:      el.attr("href"),
            uri:       el.get(0).href,
            size:      el.data("size"),
       };
       M.modal_body.html('<img src="' + modal.file + '">');
       
       Modal.setMeta(modal);
       M.viewer.modal("show");
    },

    setWebModal: function(el) {
        var modal = {
            open:      '<div class="embed-responsive embed-responsive-4by3">',
            close:      '</div>',
            file:      el.attr("href"),
            uri:       el.get(0).href,
            size:      el.data("size"),
       };
       M.modal_body.html(modal.open + '<iframe id="website" class="embed-responsive-item" src="' + modal.file + '" sandbox frameborder="0"></iframe>' + modal.close);
       
       Modal.setMeta(modal);
       M.viewer.modal("show");
    },

  setTextModal: function(el) {
      var modal = {
         open:      '<pre><code id="text">',
         close:      '</code></pre>',
         file:      el.attr("href"),
         uri:       el.get(0).href,
         size:      el.data("size"),
       };

       // Load file contents
       $.ajax(modal.file, {
           dataType: "text",
           success: function(contents) {
                // Inject content 
                M.modal_body.html(modal.open, modal.close);
                $("#text").text(decodeFile(contents));

                Modal.setMeta(modal);
           }
       }).done(function() {
           // show modal
           $(M.viewer).modal("show");
       });
  },

    setSourceModal: function(el) {
        var ext = el.attr("href")[0].split(".").pop();

        var modal = {
          open:      '<pre><code id="source"class="' + ext + '" dir="ltr">',
          close:      '</code></pre>',
          file:      el.attr("href"),
          uri:       el.get(0).href,
          size:      el.data("size"),
          highlight: el.data("highlight")
        };

        // Load file contents
        $.ajax(modal.file, {
            dataType: "text",
            success: function(contents) {
                // Inject source code
                M.modal_body.html(modal.open, modal.close);
                $("#source").text(decodeFile(contents));

                Modal.setMeta(modal);

                // Fire auto-highlighter
                $("#source").each(function(i, block) {
                    if(typeof(hljs) !== 'undefined') hljs.highlightBlock(block);
                    // adjust pre background-color
                    var background = $("code").css("background-color");
                    $("pre").css("background-color", background);
                });
            }
        }).done(function() {
            // show modal
            M.viewer.modal("show");
        });
  },

  setMeta: function(modal) {
    // Set meta
    M.full_view.attr("href", modal.file);
    
    // Set title
    M.modal_title.text(decodeFile(modal.file));

    // Set size
    meta = typeof modal.size !== 'undefined' ? modal.size : null;
    M.file_meta.text(meta);
  },

  // Stop HTML5 player
  stopPlayer: function() {
    var player = document.getElementById("player");
    
    if (player) {
        // soft pause
        player.pause();

        // hard pause
        player.src = "";
    }
  },

  reset: function() {
    // hide Highlighter button
    $(".highlight").addClass("hidden-xs-up");

    // Empty modal body to stop playback in Firefox
    M.modal_body.empty();
  }
};
