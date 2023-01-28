$(document).ready( function(){
  var parentId;
  var taskEl;
  var taskDesc;

  function init() {
    // retrieve items from local storage

    if (typeof(Storage) == "undefined") { // browser does not support storage
      return
    }

    // get the list of tasks from local storage
    tasks = JSON.parse(localStorage.getItem('tasks'));

    // do a null check
    if (tasks === null) {
      return
    }

    updateSchedule(tasks);

    return;

  }

  function updateSchedule(tasks) {
    // display the tasks in the relevant time block

    for ( let i = 0; i < tasks.length; i++ ) {
      var date;
      var hour;
      var taskDesc;

      // get the time for this task
      date = tasks[i].date;
      hour = moment(date).format('H');

      // get the task description
      taskDesc = tasks[i].event;

      printTask(hour, taskDesc);
    }

  }

  function printTask(hour, taskDesc) { 
    // display task by traversing the DOM 
    var idToFind;
    var sectionEl;
    var textareaEl;
    
    // format the id of the parent element containing the time-block to update
    idToFind = "hour-".concat(hour);
    
    // get the parent element
    sectionEl = $("section#" + idToFind);

    // get the child textarea element
    textareaEl = $(sectionEl).find("textarea");

    // set the value of the textarea element ( = task description )
    $(textareaEl).val(taskDesc);
  }

  
  // listen for Save button clicks
  $('.saveBtn').click ( function(event) {
    var button;

    // get button clicked (user may have clicked the icon - so we need to get parent 
    // object in that case)
    button = getButton(event);

    // get the task description by accessing its element
    taskEl = $(button).parent().children().filter("textarea").first();
    taskDesc = $(taskEl).val();

    // check if there is anything to save, if not Return
    if (taskDesc == null) {
      return;
    }

    // get the parent ID so we can tell what hour this is
    parentId = $(button).parent().attr('id');
    
    // get date and time
    var date = moment().format('YYYY-MM-DD');
    var hour = getFormattedHour(parentId);

    // format the object ready for storing
    var task = {
      date: moment(date + ' ' + hour),
      event: taskDesc
    }

      // save to local storage
    addTaskToLocalStorage(task);

  })

  function getButton(event) {
    // gets the button in case the icon was clicked, instead of the button

    if ($(event.target).prop("tagName") == 'I') {
      return $(event.target).parent();
    } else {
      return event.target;
    }
  }

  function getFormattedHour(id) {
    // gets the time of the event from the parent id attribute in format 'HH:00'

    if (id.length == 7) {
      return id.slice(-2) + ":00";
    } else {
      return id.slice(-1) + ":00";
    }
  }

  function addTaskToLocalStorage(task) {  
    // save event to local storage

    if (typeof(Storage) == "undefined") {
      console.log("Sorry, your browser does not support web storage...");
      return
    }

    // get the list of tasks from local storage
    tasks = JSON.parse(localStorage.getItem('tasks'));

    // do a null check
    if (tasks === null) {
      var tasks = [];
    }

    // save the task(s) to local storage
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    return;
  }

  init();

})

// save reference to important DOM elements
var timeDisplayEl = $('#time-display');

// handle displaying the time
function displayTime() {
  var rightNow = moment().format('DD MMM YYYY');
  timeDisplayEl.text(rightNow);
}

setInterval(displayTime, 1000);