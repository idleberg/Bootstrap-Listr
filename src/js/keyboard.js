var hidden = $("tr.hide");

$(document).bind('keydown', function(event) {


    if( event.altKey ) {
        $(hidden).addClass( "unhide" ).removeClass( "hide");
    }
}).bind('keyup',function(){
      // var hidden = $("tr.hide,tr.unhide");
      $(hidden).removeClass( "unhide" ).addClass( "hide");
});