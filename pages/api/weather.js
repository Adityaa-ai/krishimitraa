
import nc from 'next-connect';
import axios from 'axios';

const handler = nc();

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Severe thunderstorm with hail',
  };

  return descriptions[code] || 'Unknown weather conditions';
}

handler.post(async (req, res) => {
  try {
    const { lat, lon } = req.body || {};

    if (
      typeof lat !== 'number' ||
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90 ||
      typeof lon !== 'number' ||
      !Number.isFinite(lon) ||
      lon < -180 ||
      lon > 180
    ) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'Latitude and longitude must be valid numbers.',
      });
    }

    // Fetch actual weather data from Open-Meteo.
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: lat,
          longitude: lon,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation',
            'weather_code',
            'wind_speed_10m',
          ].join(','),
          hourly: 'precipitation_probability',
          forecast_days: 1,
          timezone: 'auto',
        },
        timeout: 15000,
      }
    );

    const weather = response.data;
    const current = weather.current;

    if (!current || !Array.isArray(weather.hourly?.time)) {
      throw new Error('Incomplete weather response');
    }

    // Match the current observation to its forecast hour.
    const currentHour = current.time.slice(0, 13);
    let index = weather.hourly.time.findIndex(
      (time) => time.slice(0, 13) === currentHour
    );

    if (index < 0) {
      index = weather.hourly.time.findIndex(
        (time) => time >= current.time
      );
    }

    const rainProbability =
      index >= 0
        ? weather.hourly.precipitation_probability?.[index] ?? null
        : null;

    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const description = getWeatherDescription(current.weather_code);

    // These are project-generated advisories, not official weather warnings.
    const alerts = [];

    if (temp >= 35) {
      alerts.push({
        event: 'High Temperature Advisory',
        description:
          'High temperatures detected. Monitor crops for heat stress.',
        severity: 'moderate',
      });
    }

    if (rainProbability !== null && rainProbability >= 70) {
      alerts.push({
        event: 'High Rain Probability',
        description:
          `Forecast precipitation probability is ${rainProbability}%.`,
        severity: 'moderate',
      });
    }

    if (current.weather_code >= 95 && current.weather_code <= 99) {
      alerts.push({
        event: 'Thunderstorm',
        description:
          'Thunderstorm conditions reported. Avoid exposed field work during lightning.',
        severity: 'severe',
      });
    }

    return res.status(200).json({
      ok: true,
      source: 'open-meteo',
      data: {
        location: `Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`,
        temp,
        description,
        humidity,
        rainProbability,
        alerts,
        feelsLike: current.apparent_temperature,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        observedAt: current.time,
        timezone: weather.timezone,
      },
    });
  } catch (error) {
    console.error(
      'Weather API error:',
      error.response?.data || error.message
    );

    return res.status(502).json({
      error: 'Weather service unavailable',
      message:
        'Could not retrieve live weather. Please try again shortly.',
    });
  }
});

export default handler;
