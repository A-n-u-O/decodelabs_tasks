# DecodeLabs Backend Development — Project 3

## Secure Authentication System

A secure authentication API built with Node.js, Express.js, PostgreSQL, Prisma ORM, Argon2, and JSON Web Tokens (JWT) as part of the DecodeLabs Backend Development Internship.

The project implements user registration and login while protecting passwords through hashing and restricting access to protected routes using JWT authentication.

## Features

- User registration
- Email and password validation
- Duplicate email prevention
- Password hashing with Argon2
- Secure password verification during login
- JWT generation after successful authentication
- JWT expiration
- Custom authentication middleware
- Protected API route
- Detection of missing, invalid, expired, or tampered tokens
- PostgreSQL data persistence

## Technologies Used

- Node.js
- Express.js
- JavaScript
- PostgreSQL
- Prisma ORM
- Argon2
- JSON Web Tokens (JWT)
- Postman

## API Endpoints

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/register` | Register a new user | No |
| POST | `/login` | Authenticate a user and generate a JWT | No |
| GET | `/profile` | Access the protected user route | Bearer Token |

## How Authentication Works

### Registration

When a user registers:

1. The email and password are validated.
2. The API checks whether the email already exists.
3. Argon2 hashes the password.
4. Only the password hash is stored in PostgreSQL.

The original plaintext password is never stored in the database.

### Login

When a user logs in:

1. The API retrieves the user by email.
2. Argon2 verifies the submitted password against the stored hash.
3. A JWT is generated when the credentials are valid.
4. The token is returned to the client.

### Protected Routes

Protected requests include the JWT using the authorization header:

```http
Authorization: Bearer <token>
```

Authentication middleware verifies the token before allowing access to the protected route.

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_url"
JWT_SECRET="your_private_jwt_secret"
PORT=3004
```

Never commit the `.env` file to source control.

### 3. Start the development server

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The API runs locally at:

```text
http://localhost:3004
```

## Example Registration Request

```http
POST /register
```

```json
{
  "email": "anu@example.com",
  "password": "mypassword123"
}
```

## Example Login Request

```http
POST /login
```

```json
{
  "email": "anu@example.com",
  "password": "mypassword123"
}
```

A successful login returns a JWT that can be used to access protected routes.

## Testing

The API was tested with Postman for:

- Successful registration
- Duplicate email registration
- Invalid email addresses
- Short passwords
- Successful login
- Incorrect passwords
- Protected requests without a token
- Protected requests with a valid token
- Tampered JWTs

## Security Practices

- Passwords are hashed before database storage.
- Plaintext passwords are not returned by API responses.
- JWT secrets are stored in environment variables.
- JWTs expire after one hour.
- Protected routes require a valid Bearer token.
- Invalid and tampered tokens return `401 Unauthorized`.
- `.env` is excluded from version control.

## What I Learned

Through this project, I practiced:

- Password hashing and verification with Argon2
- Authentication versus authorization
- Generating and verifying JSON Web Tokens
- Building custom Express middleware
- Protecting API routes
- Working with environment variables and application secrets
- Connecting authentication logic to PostgreSQL
- Testing authentication and security failure cases with Postman