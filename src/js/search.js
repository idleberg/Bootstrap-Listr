var S,
Search = {

  elements: {
      input: $('#listr-search'),
      table: $("#listr-table")
  },

  init: function() {
      S = this.elements;
      this.events();

      // Set selector for jQuery.searcher
      $(S.table).searcher({
        inputSelector: "#listr-search"
      });
  },

  events: function() {
    $(S.input).keyup(function(event){
      Search.clearInput();
    });
  },

  // Clears input when pressing Esc-key
  clearInput: function() {
    if(event.keyCode == 27) {
      if (S.input.val() ===  '') {
        S.input.blur();
      } else {
        S.input.val('');
      }
    }
  }
};
