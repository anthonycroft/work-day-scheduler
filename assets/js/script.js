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

    clearSchedule();
    displayTasksForScheduleDay(moment());
    colorTimeBlocks(moment());

    return;

  }

  function printTask(hour, taskDesc) { 
    // display task by traversing the DOM 
    
    // format the id of the parent element containing the time-block to update
    var idToFind = "hour-".concat(hour);
    
    // get the parent element
    var sectionEl = $("section#" + idToFind);

    // get the child textarea element
    var textareaEl = $(sectionEl).find("textarea");

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
    taskDesc = $(taskEl).val().trim();

    if (taskDesc == '') {
      notifyNothingToSave();
      return;
    }

    // get the parent ID so we can tell what hour this is
    parentId = $(button).parent().attr('id');
    
    // get hour from parent
    var hour = getHourFromId(parentId);
    
    // get the date so we can store event
    var scheduleDate = getScheduleDate();

    // save event to local storage
    saveTask(scheduleDate, hour, taskDesc);

  })

    // listen for Save button clicks
    $('.deleteBtn').click( async function(event) {
      var button;

      // confirm that user really wants to delete events for this date
      let confirmDel = await confirmDelete();

      if (confirmDel == false) {
        return;
      }

      // get button clicked (user may have clicked the icon - so we need to get parent 
      // object in that case)
      button = getButton(event);
  
      // get the task description by accessing associated textarea element
      taskEl = $(button).parent().children().filter("textarea").first();
      taskDesc = $(taskEl).val().trim();
  
      // get the parent ID so we can tell what hour this is
      parentId = $(button).parent().attr('id');
      
      // get hour from parent element
      var hour = getHourFromId(parentId);
      
      // get the date so we can store event
      var scheduleDate = getScheduleDate();
  
      // delete event from local storage
      deleteTask(scheduleDate, hour);
  
    })

   const confirmDelete = async () => {

      const result = await Swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure you want to delete event(s) for this date/time?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes`,
      });
      return result.isConfirmed;
    }

    // listens for click of a move button (navigate to previous or next day)
  $('.move').click(function(event) {
    
    var elementId = $(event.target).attr("id");

    var scheduleDate = getScheduleDate(); // Returns a Moment object
    
    var addOrSubtract = (elementId === 'previous') ? -1 : 1;

    // update schedule date to previous week day
    newDate = addWeekdays(scheduleDate, addOrSubtract);

    // display the new date
    displayDate(newDate);

    // clear schedule
    clearSchedule();

    // display tasks for resolved date
    displayTasksForScheduleDay(newDate);

    // color the timeblocks
    colorTimeBlocks(newDate);

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
    
    var localDate = date.format('YYYY-MM-DD'); // convert date to storage format

    // Check if the date exists in calendarTasks
    if (!calendarTasks[localDate]) {
      calendarTasks[localDate] = [];
    }

    // Check if a task already exists for this hour, if so update it
    var taskExists = false;
    for (var i = 0; i < calendarTasks[localDate].length; i++) {
      if (calendarTasks[localDate][i].hour === hour) {
          // Update the task 
          calendarTasks[localDate][i].task = taskDescription;
          taskExists = true;
        }
        break;
    }

    // Add the new task if not blank
    if (!taskExists) {
      calendarTasks[localDate].push({ hour: hour, task: taskDescription });
    }

    // update local storage
    updateLocalStorage ('calendarTasks', calendarTasks);
    
    notifySave();
    
  }

  // Function to delete a task
  function deleteTask(date, hour) {
    // Retrieve the calendar tasks from local storage
    var calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    
    var localDate = date.format('YYYY-MM-DD'); // convert date to storage format

    // check whether we have anything to delete
    if (!calendarTasks[localDate]) {
      printTask(hour, '');
      return;
    }

    // Check if a task exists for this time, if so delete it
    for (var i = 0; i < calendarTasks[localDate].length; i++) {
      
      if (calendarTasks[localDate][i].hour === hour) {
         // delete existing task
        calendarTasks[localDate].splice(i,1);
        // check to see if we no tasks for current date - in which case delete associated object
        if (calendarTasks[localDate].length == 0) {
          delete calendarTasks[localDate];
        } 
        taskExists = true;
        break;
      }
    }

    // update local storage
    updateLocalStorage ('calendarTasks', calendarTasks);
    
    // remove task from display
    printTask(hour, '');

    notifyDelete();
    
  }

  function updateLocalStorage (key, obj) {

    // Store the updated calendar tasks in local storage
    // delete if empty object
    if (Object.keys(obj).length != 0) {
      localStorage.setItem(key, JSON.stringify(obj));
    }  else {
      localStorage.removeItem(key);
    }

  }

  function clearSchedule() {
    // clears all tasks from the displayed date
    $('.description').val('');
  }

  function notifySave () {
    // notifies user that appointment has been saved
    
    $(".storage").html("Event added to <code>localstorage</code>");

    // set a timer to remove the notification after 5 seconds
    clearNotification();
  }

  function notifyDelete () {
    // notifies user that appointment has been saved
    
    $(".storage").html("Event deleted from <code>localstorage</code>");

    // set a timer to remove the notification after 5 seconds
    clearNotification();
  }

  function notifyNothingToSave () {
    // notifies user that appointment has been saved
    
    $(".storage").html("Please enter an event description in order to save.");

    // set a timer to remove the notification after 5 seconds
    clearNotification();
  }

    // clears the notification area of any message after 4 seconds
  function clearNotification () {

    setTimeout(function () {
      $(".storage").html("&nbsp;<code>&nbsp;</code>");
    }, 3000);
  
  }

    // Function to retrieve and display the tasks for the current day
    // NB Date should be a moment object
  function displayTasksForScheduleDay(date) {

    // Retrieve the calendar tasks from local storage
    var calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
  
    // Check if the current date exists in the calendar tasks
    var localDate = date.format('YYYY-MM-DD'); // convert date to storage format
    if (calendarTasks[localDate]) {
      // Loop through the tasks for the current date
      for (var i = 0; i < calendarTasks[localDate].length; i++) {
        var task = calendarTasks[localDate][i];

        // Update schedule
        printTask(task.hour, task.task);

      }
    }
  }

  // function returns the current Schedule date as a moment object
  function getScheduleDate () {

    if (isValidDate($('#time-display').text())) {
      return moment($('#time-display').text(), 'DD MMM YYYY');
    } else {
      return moment();
    }

  }
  
  // Function to add or subtract a specified number of weekdays to/from the current date
  function addWeekdays(date, daysToAdd) {

    while (daysToAdd !== 0) {
      date = date.add(daysToAdd > 0 ? 1 : -1, 'days');
      if ((date.day() !== 0 && date.day() !== 6)) {
        daysToAdd -= daysToAdd > 0 ? 1 : -1;
      }
    }

    return date;
  }

  // checks for a valid date
  function isValidDate(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  function colorTimeBlocks(date) {
    // calls the relevant function to color the time-blocks, depending om whether 
    // we are on a current, past or future schedule date
    var timeBlockEls = $(".container").find(".row.time-block").get();
    // check for past or present date
    if (date > moment().endOf('day')) {
      colorFutureOrPastTimeblocks(timeBlockEls, 'future');
    } else if (date < moment().startOf('day')) {
      colorFutureOrPastTimeblocks(timeBlockEls, 'past');
    } else {
      colorPresentTimeBlock(timeBlockEls);
    }
  }

  function colorPresentTimeBlock (timeBlockEls) {
    // calls the relevant function to color the time-blocks, depending om whether 
    // hour is current, past or in the future.

    var currentHour = moment().hour();

    // iterate over all the time-blocks setting the background appropriately
    for ( let i = 0; i < timeBlockEls.length; i++) {
      // get the hour of this time-block
      var el = $(timeBlockEls[i]);
      var id = el.attr('id');
      var hour = getHourFromId(id);

      if (hour == currentHour ) {
        addColor($(el), 'present');
      } else if (hour < currentHour ) {
        addColor($(el), 'past');
      } else {
        addColor($(el), 'future');
      }
    }
  }

  function colorFutureOrPastTimeblocks (timeBlockEls, period) {
    // Adds background color to time-block 

    for ( let i = 0; i < timeBlockEls.length; i++) {
      var el = $(timeBlockEls[i]);

      if (period === 'past') {
        addColor($(el), 'past');
      } else {                        // must be future
        addColor($(el), 'future');
      }
    }

  }

  function addColor (el, period) {
    // colors the time-block according to whether date is current, past or future period

    if (period === 'present') {
      $(el).removeAttr('class').addClass('row time-block present');
    } else if (period === 'past' ) {
      $(el).removeAttr('class').addClass('row time-block past');
    } else {
      $(el).removeAttr('class').addClass('row time-block future');
    }
  }

  // save reference to important DOM elements
  var timeDisplayEl = $('#time-display');

  // handle displaying the Schedule date - function expects a moment object
  function displayDate (dateToDisplay) {
    //convert to display format
    $(timeDisplayEl).text(dateToDisplay.format('DD MMM YYYY'));
  }

  // listens for a date change, and updates title
  setInterval(displayDate(moment()), 3000);
  // colors time-blocks on change of hour
  setInterval(colorTimeBlocks(moment()), 3000);

  init();

})




