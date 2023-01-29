var displayDate;

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
    var CurrentDayTasks = JSON.parse(localStorage.getItem('calendarTasks'));

    // do a null check
    if (CurrentDayTasks === null) {
      return
    }

    //clearSchedule();
    displayTasksForCurrentDay();
    colorTimeBlocks();

    return;

  }

  // function updateSchedule(tasks) {
  //   // display the tasks in the relevant time block

  //   for ( let i = 0; i < tasks.length; i++ ) {
  //     var date;
  //     var hour;
  //     var taskDesc;

  //     // get the 2-digit formatted time
  //     date = tasks[i].date;
  //     hour = moment(date).format('H');

  //     // get the task description
  //     taskDesc = tasks[i].event;

  //     // call function to display task
  //     printTask(hour, taskDesc);
  //   }

  // }

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
  $('.saveBtn').click( function(event) {
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

    var hour = getHourFromId(parentId);
    
    // format date for storage format (YYYY-MM-DD)
    var scheduleDate = moment($('#time-display').text()).format('YYYY-MM-DD');

      // save to local storage
    saveTask(scheduleDate, hour, taskDesc);

  })

  $('.move').click(function(event) {
    var elementId = $(event.target).attr("id");

    var scheduleDate = $('#time-display').text();
    
    if (elementId == 'previous') {

      // update schedule date to previous week day
      displayDate(moment(addWeekdays(scheduleDate, -1)).format('DD MMM YYYY'));

    } else {

      // update schedule date to next week day
      displayDate(moment(addWeekdays(scheduleDate, 1)).format('DD MMM YYYY'));
      
    }

    // clear schedule
    clearSchedule();

    // display tasks for resolved date
    displayTasksForCurrentDay();

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

    // Function to save a task
  function saveTask(date, hour, taskDescription) {
    // Retrieve the calendar tasks from local storage
    var calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};

    // Check if the date exists in the calendar tasks
    if (!calendarTasks[date]) {
      calendarTasks[date] = [];
    }

    // Check if the task already exists for the date
    var taskExists = false;
    for (var i = 0; i < calendarTasks[date].length; i++) {
      if (calendarTasks[date][i].hour === hour) {
        // Update the task
        calendarTasks[date][i].task = taskDescription;
        taskExists = true;
        break;
      }
    }

    // If the task does not already exist, add it
    if (!taskExists) {
      calendarTasks[date].push({ hour: hour, task: taskDescription });
    }

    // Store the updated calendar tasks in local storage
    localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));

    var $()
  }

  function clearSchedule() {
    console.log("we are in clearSchedule")
    $('.description').val('');
  }

    // Function to retrieve and display the tasks for the current day
  function displayTasksForCurrentDay() {
    // Retrieve the calendar tasks from local storage
    var calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};

    // format schedule date to search for key in calendarTasks
    
    if (isValidDate($('#time-display').text())) {
      scheduleDate = moment($('#time-display').text()).format('YYYY-MM-DD')
    } else {
      scheduleDate = moment().format('YYYY-MM-DD')
    }
  
    // Check if the current date exists in the calendar tasks
    if (calendarTasks[scheduleDate]) {
      // Loop through the tasks for the current date
      for (var i = 0; i < calendarTasks[scheduleDate].length; i++) {
        var task = calendarTasks[scheduleDate][i];

        // Update schedule
        printTask(task.hour, task.task);

      }
    }
  }
  
  // Function to add or subtract a specified number of weekdays to/from the current date
  function addWeekdays(date, weekdays) {
    var date = moment(date);
    var daysToAdd = weekdays;

    while (daysToAdd !== 0) {
      date = date.add(daysToAdd > 0 ? 1 : -1, 'days');
      if ((date.day() !== 0 && date.day() !== 6)) {
        daysToAdd -= daysToAdd > 0 ? 1 : -1;
      }
    }

    return date;
  }

  function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  function colorTimeBlocks() {

    // iterate over the time-blocks to color them according to whether
    // they are in the past, present or future
  
    var currentHour = moment().hour();
  
    var timeBlockEls = $(".container").find(".row.time-block").get();
  
    // iterate over all the time-blocks setting the background appropriately
    for ( let i = 0; i < timeBlockEls.length; i++) {
      // get the hour of this time-block
      var el = $(timeBlockEls[i]);
      var id = el.attr('id');
      var hour = getHourFromId(id);
  
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
  function displayDate(dateToDisplay) {
    //var date = moment().format('DD MMM YYYY');
    $(timeDisplayEl).text(dateToDisplay);
  }

  setInterval(displayDate(moment().format('DD MMM YYYY')), 1000);
  setInterval(colorTimeBlocks, 1000);

  init();

})




