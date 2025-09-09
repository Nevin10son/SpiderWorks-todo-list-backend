The backend for the todo-list application built using Node.js, Express, Mongodb atlas, jwt and bcrypt

Setup Instructions
User Authentication using JWT(JsonWebToken) ,
Each Todo API requires JWT token verification inside the API  ,
Passwords stored securely with bcrypt hashing  ,
Utilized Create, Read, Update, Delete  , 
Secure API  with JWT verification,  

API endpoints in the backend

POST /signUp - for Register a new user ,
POST /login - for Login user & get JWT token ,
POST /create  for creating a new todo ,
POST /viewtodo  for viewing todos of logged-in user ,
PUT /edit/:id - for editing a todo by ID dynamically passed ,
DELETE /delete/:id - for deleting a todo by ID ,
PUT /status/:id - for toggling status ,

