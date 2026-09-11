import express from "express";
import "dotenv/config";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3005;
if (!process.env.WEATHER_API_KEY) {
  throw new Error("WEATHER_API_KEY is missing from environment variables");
}

if (!process.env.WEATHER_API_URL) {
  throw new Error("WEATHER_API_URL is missing from environment variables");
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Third Party API !");
});

app.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    const response = await axios.get(
      `${process.env.WEATHER_API_URL}/current.json`,
      {
        params: {
          q: city,
          key: process.env.WEATHER_API_KEY,
        },
        timeout: 5000,
      },
    );

    const weather = response.data;

    const formattedWeather = {
      city: weather.location.name,
      region: weather.location.region,
      country: weather.location.country,
      localTime: weather.location.localtime,
      temperature: weather.current.temp_c,
      feelsLike: weather.current.feelslike_c,
      humidity: weather.current.humidity,
      condition: weather.current.condition.text,
      windSpeed: weather.current.wind_kph,
    };

    res.status(200).json({
      message: "Weather retrieved successfully",
      weather: formattedWeather,
    });
  } catch (error) {
    // WeatherAPI responded with an error
    if (error.response) {
      const status = error.response.status;
      const apiMessage = error.response.data?.error?.message;

      console.error("WeatherAPI error:", apiMessage);

      // Location/city was not found
      if (status === 400) {
        return res.status(404).json({
          message: apiMessage || "Location not found",
        });
      }

      // Authentication/API key problem
      if (status === 401 || status === 403) {
        return res.status(502).json({
          message: "Weather service authentication failed",
        });
      }

      return res.status(502).json({
        message: "Weather service is currently unavailable",
      });
    }

    // No response because the request exceeded our 5-second timeout
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Weather service request timed out",
      });
    }

    // Something unexpected happened in our own application
    console.error("Server error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
