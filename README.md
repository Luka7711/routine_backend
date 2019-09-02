# routine_backend

## API endpoints


** Registration **

POST/auth/login - user signs in

POST/auth/register - user registers 

GET/auth/logout - sign out 

PUT/auth/{user.id} - edit and update users username and password 

** User Intercations **

GET/routine - home page, Write Diary, To-DO buttons 

**INDEX ROUTE OF DIARIES**

GET/routine/diary - returns table of list of written diaries

**NEW FORM**

GET/routine/diary/new - returns form for creating a diary

**SHOW**

GET/routine/diary/{diary.id} - returns one diary story from list

**EDIT**

GET/routine/diary/edit/{diary.id} - returns form to edit diary

**UPDATE**

PUT/routine/diary/{diary.id} - updates diary and redirects to show page of current item

**DESTROY ROUTE**

DELETE/routine/diary/{diary.id} - deletes diary story
