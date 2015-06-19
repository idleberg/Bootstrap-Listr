var hidden = $("tr.hidden");

$(document).bind('keydown', function(event) {

    // show hidden files
    if( event.altKey ) {
        $(hidden).addClass( "reveal" ).removeClass( "hidden");
    }
    
}).bind('keyup',function(){
    
    // hide hidden files again
    $(hidden).removeClass( "reveal" ).addClass( "hidden");

});

$(document).bind('keyup', function(event) {
    
    // focus search input
    if (event.which === 70) {
        $("#search").focus();
    }

    // Control HTML5 player (only if modal is visible)
    if (viewer.hasClass('in')) {

        // Play/pause
        if (event.which === 32) {

            event.preventDefault();

            if (player.paused === false) {
              player.pause();
            } else {
              player.play();
            }
        }

        // Seek backward
        if (event.which === 37) {
            player.currentTime -= 1;
        }

        // Seek forward
        if (event.which === 39) {
            player.currentTime += 1;
        }

        // Rewind player
        if (event.which === 37 && event.shiftKey) {
            player.currentTime = 0;
        }

        // Increase volume
        if (event.which === 38) {
            player.volume += 0.1;
        }

        // Max volume
        if (event.which === 38 && event.shiftKey) {
            player.volume = 1;
        }

        // Decrease volume
        if (event.which === 40) {
            player.volume -= 0.1;
        }

        // Mute volume
        if (event.which === 40 && event.shiftKey) {
            player.volume = 0;
        }

    }
});