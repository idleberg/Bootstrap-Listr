var hidden = $("tr.hidden");

$(document).bind('keydown', function(event) {


    if( event.altKey ) {
        $(hidden).addClass( "reveal" ).removeClass( "hidden");
    }
}).bind('keyup',function(){
      $(hidden).removeClass( "reveal" ).addClass( "hidden");
});