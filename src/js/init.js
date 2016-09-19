$(function() {

  // Remember loader
  sessionStorage.setItem("Listr.loaderContent", $(".modal-body").html())

  Keyboard.init();
  Modal.init();

  if(jQuery().searcher) {
    Search.init();
  }

});