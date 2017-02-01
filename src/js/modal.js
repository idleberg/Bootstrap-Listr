var M,
Modal = {

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
    google: $(".google-link")
  },

  init: function() {
      M = this.elements;
      this.events();
  },

  events: function() {
    $(M.viewer).on('shown.bs.modal', function (e) {
      var el = $(e.relatedTarget);

      var type = el.data("type");

      var loader = $(M.modal_body).html();
      sessionStorage.setItem("ListrLoader" ,loader);

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
      } else if (type === 'pdf') {
        Modal.setPdfModal(el);
      } else if (type === 'virtual') {
        Modal.setVirtualModal(el);
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
            open:  null,
            close: null,
            file:  el.attr("href"),
            uri:   el.get(0).href,
            size:  el.data("size"),
       };
       if (!modal.file) return;
       
       M.modal_body.html('<audio src="' + modal.file + '" id="player" autoplay preload controls>Your browser does not support the audio element.</audio>');
       
       Modal.setMeta(modal);
    },

    setVideoModal: function(el) {
        var modal = {
            open:  null,
            close: null,
            file: el.attr("href"),
            uri:  el.get(0).href,
            size: el.data("size"),
       };
       if (!modal.file) return;

       M.modal_body.html('<video src="' + modal.file + '" id="player" autoplay preload controls>Video format or MIME type is not supported</video>');
       
       Modal.setMeta(modal);
    },

    setImageModal: function(el) {
        var modal = {
            open:  null,
            close: null,
            file: el.attr("href"),
            uri:  el.get(0).href,
            size: el.data("size"),
       };
       if (!modal.file) return;

       M.modal_body.html('<img src="' + modal.file + '">');
       
       Modal.setMeta(modal);
    },

    setWebModal: function(el) {
        var modal = {
            open:  '<div class="embed-responsive embed-responsive-4by3">',
            close: '</div>',
            file:  el.attr("href"),
            uri:   el.get(0).href,
            size:  el.data("size"),
       };
       if (!modal.file) return;

       modal.html = '<iframe id="website" class="embed-responsive-item" src="' + modal.file + '" sandbox frameborder="0"></iframe>';

       M.modal_body.html(modal.open + modal.html + modal.close);       
       Modal.setMeta(modal);
    },

    setPdfModal: function(el) {
        var modal = {
            open:  '<div class="embed-responsive embed-responsive-4by3">',
            close: '</div>',
            file:  el.attr("href"),
            uri:   el.get(0).href,
            size:  el.data("size"),
       };
       if (!modal.file) return;

       modal.html = '<iframe class="embed-responsive-item" src="' + modal.file + '" type="application/pdf" scale="aspect" frameborder="0"></iframe>';

       M.modal_body.html(modal.open + modal.html + modal.close);       
       Modal.setMeta(modal);
    },

    setVirtualModal: function(el) {
        var modal = {
            open:  '<div class="embed-responsive embed-responsive-16by9">',
            close: '</div>',
            file:  el.attr("href"),
            uri:   el.data("url"),
            size:  el.data("url"),
            id:    el.data("id")
       };

       if (modal.file.endsWith('.soundcloud')) {
        modal.open = '<div class="embed-responsive embed-responsive-4by3">';
        modal.html = '<iframe id="virtual" class="embed-responsive-item" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/' + modal.id + '&amp;auto_play=true&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>';
       } else if (modal.file.endsWith('.flickr')) {
        modal.open = '<div class="embed-responsive embed-responsive-1by1">';
        modal.html = '<iframe id="virtual" class="embed-responsive-item" src="https://www.flickr.com/photos/' +  modal.id + '/player/" scrolling="no" frameborder="0" allowfullscreen></iframe>';
       } else if (modal.file.endsWith('vimeo')) {
        modal.open = '<div class="embed-responsive embed-responsive-16by9">';
        modal.html = '<iframe id="virtual" class="embed-responsive-item" src="https://player.vimeo.com/video/' + modal.id + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" allowfullscreen>Video format or MIME type is not supported</iframe>';
       } else if (modal.file.endsWith('youtube')) {
        modal.open = '<div class="embed-responsive embed-responsive-16by9">';
        modal.html = '<iframe id="virtual" class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/' + modal.id + '?autoplay=1&amp;rel=0&amp;showinfo=0" frameborder="0" allowfullscreen>Video format or MIME type is not supported</iframe>';
       }

       M.modal_body.html(modal.open + modal.html + modal.close);
       Modal.setMeta(modal);
    },

  setTextModal: function(el) {
      var modal = {
         open:  '<pre><code id="text">',
         close: '</code></pre>',
         file:  el.attr("href"),
         uri:   el.get(0).href,
         size:  el.data("size")
       };

       if (!modal.file) return;

       Modal.setMeta(modal);
       M.modal_body.html(modal.open, modal.close);
       $("#text").load(modal.file);
  },

    setSourceModal: function(el) {
        var ext = el.attr("href")[0].split(".").pop();

        var modal = {
          open:      '<pre><code id="source"class="' + ext + '" dir="ltr">',
          close:      '</code></pre>',
          file:      el.attr("href"),
          uri:       el.get(0).href,
          size:      el.data("size")
        };

        if (!modal.file) return;

        Modal.setMeta(modal);
        M.modal_body.html(modal.open, modal.close);

        $("#source").load(modal.file, function() {
          // Fire auto-highlighter
          $("#source").each(function(i, block) {
              if(typeof(hljs) !== 'undefined') hljs.highlightBlock(block);
              // adjust pre background-color
              var background = $("code").css("background-color");
              $("pre").css("background-color", background);
          });
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

    // Populate Dropbox drop-in
    M.dropbox.attr("href", modal.file);
    
    // Populate share buttons
    M.email.attr("href", "mailto:?body=" + modal.uri);
    M.twitter.attr("href", "http://twitter.com/share?url=" + modal.uri);
    M.facebook.attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + modal.uri);
    M.google.attr("href", "https://plus.google.com/share?url=" + modal.uri);
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
    var loader = sessionStorage.getItem("ListrLoader");

    // Empty modal body to stop playback in Firefox
    M.modal_body.html(loader);
  }
};