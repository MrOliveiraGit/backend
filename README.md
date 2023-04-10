to start the application just use

```
npm i

docker compose up
```


Endpoints
Create a User

bash

POST /user

Create a new user.
Request

json
```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```
Response

json
```
{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```
Get a User by ID

bash

GET /user/:id

Retrieve a user by ID from https://reqres.in/.
Response

json
```
{
  "user": {
    "id": 1,
    "email": "george.bluth@reqres.in",
    "first_name": "George",
    "last_name": "Bluth",
    "avatar": "https://reqres.in/img/faces/1-image.jpg"
  }
}
```
Get User Avatar by ID

bash

GET /user/avatar/:id

Retrieve a user's avatar by ID.
Response

json
```
{
  "avatar": "https://example.com/avatar.jpg"
}
```
Retrieve a User from Database by ID

sql

GET /user/user-by-db/:id

Retrieve a user from the database by ID.
Response

json
```
{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```
Update a User by ID

bash

PUT /user/:id

Update a user by ID.
Request

json
```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```
Response

json
```
{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```
Remove User Avatar by ID

bash

DELETE /user/avatar/:id

Remove a user's avatar by ID.
Response

Avatar successfully removed

User Schema

typescript

import { Prop } from '@nestjs/mongoose';

export class User {
  @Prop()
  id: number;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  avatar: string;
}