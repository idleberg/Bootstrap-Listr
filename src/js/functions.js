// update file counter
var column = $('#file-count').index();
var striped_bg = $('.table-striped > tbody > tr:nth-of-type(odd)').css('background-color');

var countRows = function() {
    $('tbody tr:not(.hidden) > td:nth-of-type('+column+1+')').each(function(index,elem){
        index+=1;
        $(this).text(index);
    });

    // fix for striped tables
    if ($('#listr-table').has('.table-striped')) {
        $('tbody tr').css("background-color", "inherit");
        $('tbody tr:not(.hidden):odd').css( "background-color", striped_bg );
    }
};
countRows();