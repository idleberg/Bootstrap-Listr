if(jQuery().stupidtable) {
  var table = $("#listr-table").stupidtable();

  table.bind('aftertablesort', function (event) {
    countRows();
  });
}