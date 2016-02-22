// update file counter
var column = $('#file-count').index();
var striped_bg = $('.table-striped > tbody > tr:nth-of-type(odd)').css('background-color');
var hover_bg;

// CSS fix for striped tables
var stripedRows = function() {
    if ($('#listr-table').has('.table-striped')) {
        $('tbody tr').css( "background-color", "inherit");
        $('tbody tr:not(.hidden-xs-up):even').css( "background-color", striped_bg );
    }
};
stripedRows();

// CSS fix for .table-hover
$('.table-hover>tbody>tr').bind({
  mouseenter: function(e) {
    if( !hover_bg ) {
        $(this).removeAttr('style');
        hover_bg = $(this).css('background-color');
    }
    $(this).css( "background-color", hover_bg);
  },
  mouseleave: function(e) {
    stripedRows();
  }
});