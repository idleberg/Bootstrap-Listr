if(jQuery().searcher) {

  // Set selector for jQuery.searcher
  $("#bs-table").searcher({
    inputSelector: "#search"
  });

  // Clears input when pressing Esc-key
  $('#search').keyup(function(e){
      if(e.keyCode == 27) {
          $(this).val('');
      }
  });
  
}