## work-day-scheduler
A perpetual work day activity scheduler.

## Description
The app allows the user to diarise information such as daily tasks or appointments associating them to an hour of the day.

Information entered can be stored to the browser's local storage by clicking the *Save* button at the end of the relevant time-block; a notification is displayed at the top of the diary section for approximately 3 seconds confirming that the data has been saved. 

Data entered and not saved will be lost once the user navigates away from the current day (by clicking the previous or next icons - see below) *or* we move past midnight (in the local timezone) thus triggering the app to display the new day.

A user can delete data for any time period by clicking on the *Delete* button positioned at the end of each time-block (next to the *Save* button). A warning is displayed prompting the user to confirm event(s) deletion prior to data being removed. As with the *Save* button a notfication confirming event(s) deletion is displayed in the notification area above the diary display.

The user can move between days by clicking the '<' (previous) or '>' (next) icons at the top of the scheduler. Previously stored schedule information for the new day is displayed in the relevant time-blocks.

Time-blocks are color-coded for ease of reference as follows:
- grey = past time periods
- red = current time period
- green = future time periods

## Dependencies
The app uses the following external Javascript libraries:

[jQuery](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js)

[Moment](https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js)

[Sweetalert2](https://sweetalert2.github.io/)

## Limitations
The storage capability of the app is determined by the browser's local storage size. It should be noted that some browsers, particularly older ones, may not permit local data storage; in which case the user may wish to switch to one that does.

The app does not display any other schedule *views* other than a *daily* one. A future upgrade would consider adding other views such as a weekly or monthly view, to enhance usability.

## Deployed Link:

[Work Day Scheduler](https://anthonycroft.github.io/work-day-scheduler/)

## Repo Link:

[Repository](https://github.com/anthonycroft/work-day-scheduler)

## Screenshots:

![Work Day Scheduler Home Page](https://github.com/anthonycroft/work-day-scheduler/blob/main/assets/images/work-day-scheduler.png))