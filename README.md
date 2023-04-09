#Backend Test

This is a NestJS project that contains routes for managing users and their avatars.
Routes

The following routes are available:

    POST /user: Creates a new user.

    GET /user/:id: Returns a user with the specified ID. The user is obtained from an external API (https://reqres.in/).

    GET /user/:id/avatar: Returns the avatar of the user with the specified ID. The avatar is stored on disk and accessed from the file system.

    POST /user/:id/avatar: Updates the avatar of the user with the specified ID. The avatar is sent as a multipart/form-data file and stored on disk. The file path is recorded in the database.
    GET /user/user-by-db/:id: Returns a user with the specified ID. The user is obtained from the database.
    
    DELETE /user/:id/avatar: Removes the avatar of the user with the specified ID. The avatar is removed from the file system and the file path is removed from the database.

How to Access the Routes

The routes can be accessed using the appropriate HTTP method and URL. Details for each route can be found in the section above.
How to Start the Project

To start the project, you can use Docker Compose with the following command:

```docker compose up```

This command will download the necessary dependencies, build the Docker image, and start the container. You can then access the routes using the appropriate URL in your browser or HTTP client.