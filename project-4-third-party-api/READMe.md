# DecodeLabs Backend Development — Project 4

## Third-Party API Integration

A REST API built with Node.js and Express.js that integrates with an external weather service using WeatherAPI.

The project demonstrates how a backend application can securely communicate with a third-party API, handle asynchronous requests, transform external data into a cleaner response, and gracefully handle external service errors.

## Features

- Fetches real-time weather data from a third-party API
- Accepts a city using query parameters
- Uses Axios for asynchronous HTTP requests
- Stores the external API key securely in environment variables
- Transforms third-party weather data into a simplified API response
- Validates required query parameters
- Handles invalid or unknown locations
- Handles external API authentication failures
- Implements request timeout handling
- Returns appropriate HTTP status codes
- Prevents sensitive API credentials from being committed to GitHub

## Technologies Used

- Node.js
- Express.js
- JavaScript
- Axios
- WeatherAPI
- dotenv
- Postman

## API Endpoint

### Get Current Weather

```http
GET /weather?city=Lagos
```

The `city` query parameter is required.

Example request:

```http
GET http://localhost:3005/weather?city=Lagos
```

Example successful response:

```json
{
  "message": "Weather retrieved successfully",
  "weather": {
    "city": "Lagos",
    "region": "Lagos",
    "country": "Nigeria",
    "localTime": "2026-09-11 02:30",
    "temperature": 25.3,
    "feelsLike": 27.1,
    "humidity": 88,
    "condition": "Partly cloudy",
    "windSpeed": 11.2
  }
}
```

Weather values will vary depending on the current conditions.

## How It Works

The client sends a request to the Express API:

```text
Client / Postman
       ↓
GET /weather?city=Lagos
       ↓
Express API
       ↓
Axios request
       ↓
WeatherAPI
       ↓
External weather data
       ↓
Response transformation
       ↓
Clean JSON response
```

The external API key remains on the server and is never returned to the client.

## Error Handling

The API handles several possible failure scenarios:

- Missing city → `400 Bad Request`
- Location not found → `404 Not Found`
- Third-party authentication failure → `502 Bad Gateway`
- Third-party service failure → `502 Bad Gateway`
- Third-party request timeout → `504 Gateway Timeout`
- Unexpected server error → `500 Internal Server Error`

## Environment Variables

Create a `.env` file in the project root:

```env
WEATHER_API_KEY="your_weather_api_key"
WEATHER_API_URL="https://api.weatherapi.com/v1"
PORT=3005
```

The `.env` file is excluded from version control.

An `.env.example` file is provided to show the required environment variables without exposing private credentials.

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create your `.env` file using `.env.example` as a reference and add your WeatherAPI key.

### 3. Start the development server

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The API runs on:

```text
http://localhost:3005
```

## Testing

The API was tested using Postman for:

- Successful weather retrieval
- Missing city parameter
- Invalid/non-existent location
- External API errors
- Request timeout handling
- Correct response transformation

## Security Practices

- API credentials are stored in environment variables
- `.env` is excluded using `.gitignore`
- An `.env.example` file contains placeholders only
- External API credentials are never returned to clients
- Required environment variables are checked when the server starts

## What I Learned

Through this project, I practiced:

- Integrating third-party APIs into a Node.js backend
- Making asynchronous HTTP requests with Axios
- Working with query parameters
- Managing API keys securely
- Transforming external API responses
- Handling third-party API failures
- Using HTTP status codes appropriately
- Implementing timeouts and graceful error handling