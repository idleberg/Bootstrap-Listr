var K,
Keyboard = {

  elements: {
      hidden: $("tr.hidden-xs-up"),
      keyboard: $("#viewer-modal"),
      search: $("#listr-search"),
      viewer: $("#viewer-modal")
  },

  init: function() {
      K = this.elements;
      this.events();
  },

  // Keyboard events
  events: function() {
    $(document).bind('keydown', function(event) {
      Keyboard.revealFiles();
    }).bind('keyup',function(){
        Keyboard.hideFiles();
    });

    $(document).bind('keyup', function(event) {
        Keyboard.playerControls();
    });

    $(document).bind('keyup', function(event) {
        Keyboard.focusSearch();
    });
  },

  // show hidden files
  revealFiles: function() {
      if( event.altKey ) {
          $(K.hidden).addClass( "reveal" ).removeClass( "hidden-xs-up");
          stripedRows();
      }
  },

  // hide hidden files again
  hideFiles: function() {
      $(K.hidden).removeClass( "reveal" ).addClass( "hidden-xs-up");
      stripedRows();
  },

  // focus search input
  focusSearch: function() {
      if ( !K.viewer.hasClass('in')) {
        if (event.which === 70) {
            $(K.search).focus();
            $(document).scrollTop(0);
        }
      }
  },

  // Control HTML5 player
  playerControls: function() {
    // Only when modal is visible
    if ( (K.viewer.hasClass('in')) && (typeof player !== 'undefined') ) {

      // Fullscreen
      if (event.which === 70) {
        if (player.requestFullscreen) {
          player.requestFullscreen();
        } else if (player.msRequestFullscreen) {
          player.msRequestFullscreen();
        } else if (player.mozRequestFullScreen) {
          player.mozRequestFullScreen();
        } else if (player.webkitRequestFullscreen) {
          player.webkitRequestFullscreen();
        }
      }

      // Play/pause
      if (event.which === 32) {

        event.preventDefault();

        if (player.paused === false) {
          player.pause();
        } else {
          player.play();
        }
      }

      playerEnd = player.seekable.end(0)

      // Seek backward
      if (event.which === 37) {
        if (player.currentTime >= 1) {
          player.currentTime -= 1;
        }
      }

      // Seek forward
      if (event.which === 39) {
        if (player.currentTime <= playerEnd - 1) {
          player.currentTime += 1;
        }
      }

      // Rewind player
      if (event.which === 37 && event.shiftKey) {
        player.currentTime = 0;
      }

      // Seek to end
      // if (event.which === 39 && event.shiftKey) {
      //   player.currentTime = playerEnd;
      // }

      // Increase volume
      if (event.which === 38) {
        if (player.volume < 1) {
          player.volume += 0.1;
        }
      }

      // Max volume
      if (event.which === 38 && event.shiftKey) {
        player.volume = 1;
      }

      // Decrease volume
      if (event.which === 40) {
        if (player.volume > 0) {
          player.volume -= 0.1;
        }
      }

      // Mute volume
      if (event.which === 40 && event.shiftKey) {
        player.volume = 0;
      }
    }
  }
};
