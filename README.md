# How to Start the Application

To start the application, follow the steps below:

1. Open your terminal and navigate to the root directory of the application.

2. Run the command `npm i` to install the project dependencies.

3. Run the command `docker compose up` to start the database and the application.

   **Note:** Docker will create a volume to persist the database data, even if you stop and restart the application container. If you want to remove all database data and the corresponding volume, run the following commands:

1. `docker compose down`
2. `docker volume rm backend_mongodb_data_container`

With these steps, the application should be up and running and you can start interacting with the available endpoints.

## Endpoints

### Create a User and Save to Database

**Endpoint:** `POST /user`

This endpoint allows you to create a new user and save it to the database. To create a user, you need to send a JSON object in the request body with the following properties:

- `id`: number, required
- `firstName`: string, required
- `lastName`: string, required
- `email`: string, required
- `avatar`: string, optional

Example request body:

```json
{
    "id": "1"
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/avatar.jpg"
}
```

Example response body:

```json
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
### Retrive user in https://reqres.in/.

**Endpoint:** `GET /user/:id`

This enpoint retrives a user from reqres.in with a id. To retrive a user, you need to send a id in param.

- `id`: number

Example request url:

GET : `localhost:3000/user/1`

Example response body:

```json
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
**Endpoint:** note, the fields is diferent `first_name`, `last_name`

