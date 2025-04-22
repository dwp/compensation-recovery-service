//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here
var filters = {}

/* ------------------------------------------------------------------
  keep the following line to return your filters to the app
------------------------------------------------------------------ */

filters.toMonth = function(x) {
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];   
  if (x > 0){ return months[x - 1]; // returns date as per month      
  } else {
          return x ;      
  }}     
  filters.toMoney = function(x){  return("£" + x );
  //TO ADD - case to handle nothing being there 
}

// Add the filters using the addFilter function
Object.entries(filters).forEach(([name, fn]) => addFilter(name, fn))
