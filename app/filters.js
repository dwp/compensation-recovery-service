//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//
const { DateTime } = require('luxon')
const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here
let filters = {}

/* ------------------------------------------------------------------
  keep the following line to return your filters to the app
------------------------------------------------------------------ */

filters.baseDate = function(format,num) {
  const daysToReduce = Math.ceil(num);
  const date = DateTime.now().minus({ days: daysToReduce }).toFormat(format)
  return date.isValid ? date : ''
}

filters.toMonth = function(x) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return x > 0 ? months[x - 1]: x
}

// Add the filters using the addFilter function
Object.entries(filters).forEach(([name, fn]) => addFilter(name, fn))
