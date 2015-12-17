if(jQuery().searcher) {

  // Set selector for jQuery.searcher
  $("#listr-table").searcher({
    inputSelector: "#listr-search"
  });

  // Clears input when pressing Esc-key
  $('#listr-search').keyup(function(e){
      if(e.keyCode == 27) {
          $(this).val('');
      }
  });
  
}