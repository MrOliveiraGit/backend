To start the application, follow these steps:

    Install the necessary dependencies by running npm i.
    Start the Docker container by running docker compose up.

Endpoints:

Create a User and save it to the database:

POST /user

Create a new user.

Request:

JSON

perl

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/avatar.jpg"
}

Response:

JSON

perl

{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}

Get a User by ID:

GET /user/:id

Retrieve a user by ID from https://reqres.in/.

Response:

JSON

perl

{
  "user": {
    "id": 1,
    "email": "george.bluth@reqres.in",
    "first_name": "George",
    "last_name": "Bluth",
    "avatar": "https://reqres.in/img/faces/1-image.jpg"
  }
}

Get User Avatar by ID:

GET /user/avatar/:id

Retrieve a user's avatar by ID.

Response:

JSON

json

{
  "avatar": "https://example.com/avatar.jpg"
}

Retrieve a User from Database by ID:

SQL

GET /user/db/:id

Retrieve a user from the database by ID.

Response:

JSON

perl

{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}

Update a User by ID:

PUT /user/:id

Update a user by ID.

Request:

JSON

perl

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}

Response:

JSON

perl

{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}

Remove User Avatar by ID:

DELETE /user/avatar/:id

Remove a user's avatar by ID.

Response:

Avatar successfully removed.

User Schema:

TypeScript

less

export class User {
    @Prop()
    id: number
    @Prop()
    firstName:string
    @Prop()
    lastName:string
    @Prop()
    email:string
    @Prop()
    avatar:string
}
}
