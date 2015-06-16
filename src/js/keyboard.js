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
});