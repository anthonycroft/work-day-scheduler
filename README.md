## work-day-scheduler
A perpetual week day activity planner.

## Description
The app allows the user to diarise information such as daily tasks or appointments associating them to an hour of the day.

Information entered can be stored to the browser's local storage by clicking the *Save* button at the end of the relevant time-block; a notification is displayed at the top of the diary section for approximately 5 seconds confirming that the data has been saved. 

Data entered and not saved will be lost once the user navigates away from the current day (by clicking the previous or next icons - see below) *or* we move past midnight (in the local timezone) thus triggering the app to display the new day.

The user can move between days by clicking the '<' (previous) or '>' (next) icons at the top of the diary. Previously stored diary information for the new day is displayed in the relevant time-blocks.

Time-blocks are color-coded for ease of reference as follows:

- \textcolor{gray}{grey} = past time periods
- \textcolor{red}{red} = current time period
- \textcolor{green}}{green} = future time periods

## Dependencies
The app uses the folowing external libraries:

- jQuery:     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
- Moment.js:  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js

## Limitations
The storage capability of the app is determined by the browser's local storage size. It should be noted that some browsers, particularly older ones, may not permit local data storage; in which case the user may wish to switch to one that does.

## Deployed Link:
Javascript Coding Quiz

## Repo Link:
Repository

## Screenshots: