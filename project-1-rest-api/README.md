# DecodeLabs Backend Development — Project 1

## REST API Basics

A simple REST API built with Node.js and Express.js as part of the DecodeLabs Backend Development Internship.

This project demonstrates fundamental backend development concepts including routing, HTTP methods, request and response handling, input validation, status codes, and basic API error handling.

## Features

- Create users through a REST API
- Retrieve all users
- Validate incoming request data
- Prevent duplicate user entries
- Handle unsupported routes with a 404 response
- Return appropriate HTTP status codes and JSON responses

## Technologies Used

- Node.js
- Express.js
- JavaScript
- Postman

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/users` | Retrieve all users |
| POST | `/users` | Create a new user |

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node server.js
```

### 3. Test the API

Use Postman or another API client to send requests to the local server.

Example:

```http
GET http://localhost:3000/users
```

## Example Request

```json
{
  "name": "Anu",
  "role": "Developer"
}
```

## Example Response

```json
{
  "message": "User created successfully"
}
```

## What I Learned

Through this project, I practiced:

- Setting up an Express.js server
- Creating REST API routes
- Working with `req` and `res`
- Parsing JSON request bodies
- Using HTTP status codes
- Validating request data
- Preventing duplicate entries
- Testing and debugging APIs with Postman

## Note

User data in this project is stored in memory and resets whenever the server restarts. Database persistence is introduced in a later project.