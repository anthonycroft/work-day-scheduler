// save reference to important DOM elements
var timeDisplayEl = $('#time-display');

// handle displaying the time
function displayTime() {
  var rightNow = moment().format('DD MMM YYYY');
  timeDisplayEl.text(rightNow);
}

setInterval(displayTime, 1000);