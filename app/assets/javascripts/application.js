/* global $ */

//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//


$(document).ready(function () {
})


var numItems = $('.countcompleted').length
$( "span.numcompleted" ).text( numItems );

$(document).ready(function(){
  $('#reloadpage').click();
});

