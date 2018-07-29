Folder Structure:

1) we have public folder which internally contains controllers and html_pages folders.
2) controller page contains controller.js which is controller for all the webpages.
3) html_pages contains admins and employee folder.
4) admins folder contains all the admin related web pages.
5) employee folder contains all the employee related web pages
6) we have server.js on the root folder which contains all the api calls.

Installing :
1) Install mongo db from the mongodb website
2) Install the dependencies like express,cors,mongojs using command "npm install".
3) In the mongo db create contact list database which contains users(which contains users information),admins(which contains admins info),
   emailFrom(which keeps the trackof received feedbacks from the different users) and emailTo(keeps the track of sent feedbacks to different 
   users as innser No-SQL dataforms 

Execution :
1) Run the mongo db server.
2) Run the server.js file.
