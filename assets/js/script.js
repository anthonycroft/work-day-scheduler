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
    colorTimeBlocks();

    return;

  }

  function updateSchedule(tasks) {
    // display the tasks in the relevant time block

    for ( let i = 0; i < tasks.length; i++ ) {
      var date;
      var hour;
      var taskDesc;

      // get the 2-digit formatted time
      date = tasks[i].date;
      hour = moment(date).format('H');

      // get the task description
      taskDesc = tasks[i].event;

      // call function to display task
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

    // get the task description by accessing associated textarea element
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
    var hour = getHourFromId(parentId).concat(":00");

    // format the object ready for storing
    var task = {
      date: moment(date + ' ' + hour),
      event: taskDesc
    }

      // save to local storage
    addTaskToLocalStorage(task);

  })

  $('.move').click(function(event) {
    var elementId = $(event.target).attr("id");
    
    if (elementId = 'previous') {
      // load previous day's schedule

    }

  });

  function getButton(event) {
    // gets the button in case the icon was clicked, instead of the button

    if ($(event.target).prop("tagName") == 'I') {
      return $(event.target).parent();
    } else {
      return event.target;
    }
  }

  function getHourFromId(id) {
    // gets the time of the event from the parent id attribute in format 'HH:00'

    if (id.length == 7) {
      return id.slice(-2);
    } else {
      return id.slice(-1);
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

  function colorTimeBlocks() {

    // iterate over the time-blocks to color them according to whether
    // they are in the past, present or future
  
    var currentHour = moment().hour();
  
    // const timeBlockIds = $('.time-block').map(function() {
    //   return this.id;
    // }).get();
  
    var timeBlockEls = $(".container").find(".row.time-block").get();
  
    // iterate over all the time-blocks setting the background appropriately
    for ( let i = 0; i < timeBlockEls.length; i++) {
      // get the hour of this time-block
      var el = $(timeBlockEls[i]);
      var id = el.attr('id');
      var hour = getHourFromId(id)
  
      if (hour == currentHour ) {
        $(el).addClass('present');
      } else if (hour < currentHour ) {
        $(el).addClass('past');
      } else {
        $(el).addClass('future');
      }
    }
  
  }

  // save reference to important DOM elements
  var timeDisplayEl = $('#time-display');

  // handle displaying the time
  function displayTime() {
    var rightNow = moment().format('DD MMM YYYY');
    timeDisplayEl.text(rightNow);
  }

  setInterval(displayTime, 1000);
  setInterval(colorTimeBlocks, 1000);

  init();

})




