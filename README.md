## work-day-scheduler
A perpetual week day activity planner.

## Description
The app allows the user to diarise information such as daily tasks or appointments associating them to an hour of the day.

Information entered can be stored to the browser's local storage by clicking the *Save* button at the end of the relevant time-block; a notification is displayed at the top of the diary section for approximately 3 seconds confirming that the data has been saved. 

Data entered and not saved will be lost once the user navigates away from the current day (by clicking the previous or next icons - see below) *or* we move past midnight (in the local timezone) thus triggering the app to display the new day.

A user can delete data for any time period by clicking on the *Delete* button positioned at the end of each time-block. A warning is displayed prompting the user to confirm event(s) deletion prior to data being removed.

The user can move between days by clicking the '<' (previous) or '>' (next) icons at the top of the diary. Previously stored diary information for the new day is displayed in the relevant time-blocks.

Time-blocks are color-coded for ease of reference as follows:
- grey = past time periods 
- red = current time periods 
- green = future time periods 

## Dependencies
The app uses the folowing external Javascript libraries:

[jQuery](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js)

[Moment](https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js)

[Sweetalert2](https://sweetalert2.github.io/)

## Limitations
The storage capability of the app is determined by the browser's local storage size. It should be noted that some browsers, particularly older ones, may not permit local data storage; in which case the user may wish to switch to one that does.

## Deployed Link:

[Work Day Scheduler](https://anthonycroft.github.io/work-day-scheduler/)

## Repo Link:

[Repository](https://github.com/anthonycroft/work-day-scheduler)

## Screenshots: