if(typeof(Dropbox) !== 'undefined') {

	// Save to Dropbox
    $(".save-dropbox").click(function(c) {
        c.preventDefault();
        var b = $(this).get(0).href;
        Dropbox.save(b);
    });

}