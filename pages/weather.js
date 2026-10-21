
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';

const LOCATIONS = {
  Nashik: { lat: '19.9975', lon: '73.7898' },
  Mumbai: { lat: '19.0760', lon: '72.8777' },
};

function getWeatherIcon(description = '') {
  const value = description.toLowerCase();

  if (value.includes('thunderstorm')) return '⛈️';
  if (value.includes('snow')) return '❄️';
  if (value.includes('rain') || value.includes('drizzle')) return '🌧️';
  if (value.includes('fog')) return '🌫️';
  if (value.includes('overcast')) return '☁️';
  if (value.includes('cloud')) return '🌤️';
  if (value.includes('clear')) return '☀️';

  return '🌦️';
}

export default function Weather() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  const chooseLocation = (name) => {
    const location = LOCATIONS[name];
    setLat(location.lat);
    setLon(location.lon);
    setSelectedLocation(name);
    setWeatherData(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latNum = Number(lat);
    const lonNum = Number(lon);

    if (
      lat.trim() === '' ||
      lon.trim() === '' ||
      !Number.isFinite(latNum) ||
      !Number.isFinite(lonNum) ||
      latNum < -90 ||
      latNum > 90 ||
      lonNum < -180 ||
      lonNum > 180
    ) {
      setError('Enter valid latitude (-90 to 90) and longitude (-180 to 180).');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: latNum, lon: lonNum }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to fetch live weather.');
      }

      if (!result.data || result.source !== 'open-meteo') {
        throw new Error('Live weather data was not returned by the server.');
      }

      setWeatherData(result.data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAlertStyle = (severity) => {
    if (severity === 'severe') {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    if (severity === 'moderate') {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  const formatObservationTime = (value, timezone) => {
    if (!value) return 'Not provided by weather service';

    // Open-Meteo returns a local observation time and its timezone separately.
    return `${value.replace('T', ' ')} (${timezone || 'local time'})`;
  };

  return (
    <>
      <Head>
        <title>Live Weather Forecast | KrishiSethuu</title>
        <meta
          name="description"
          content="Check live weather conditions and precipitation forecasts for farming."
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Live weather powered by Open-Meteo
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Weather Forecast
            </h1>

            <p className="text-gray-600 text-lg">
              Check conditions for your farm and plan farming activities better.
            </p>
          </section>

          <section className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Choose a location
            </h2>

            <div className="flex flex-wrap gap-3 mb-6">
              {Object.keys(LOCATIONS).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => chooseLocation(name)}
                  disabled={loading}
                  className={`rounded-lg border px-4 py-2 font-medium transition ${
                    selectedLocation === name
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                  }`}
                >
                  📍 {name}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lat"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    id="lat"
                    type="number"
                    value={lat}
                    onChange={(e) => {
                      setLat(e.target.value);
                      setSelectedLocation('');
                    }}
                    placeholder="e.g. 19.9975"
                    step="any"
                    min="-90"
                    max="90"
                    required
                    disabled={loading}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lon"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    id="lon"
                    type="number"
                    value={lon}
                    onChange={(e) => {
                      setLon(e.target.value);
                      setSelectedLocation('');
                    }}
                    placeholder="e.g. 73.7898"
                    step="any"
                    min="-180"
                    max="180"
                    required
                    disabled={loading}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Fetching live weather...' : 'Get Live Weather'}
              </button>
            </form>
          </section>

          {error && (
            <div
              role="alert"
              className="card mb-6 bg-red-50 border border-red-200 text-red-800"
            >
              <strong>Weather unavailable:</strong> {error}
            </div>
          )}

          {weatherData && (
            <section className="space-y-6">
              <div className="card overflow-hidden">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Current conditions for
                  </p>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {selectedLocation || weatherData.location}
                  </h2>

                  <div className="text-7xl my-5" aria-hidden="true">
                    {getWeatherIcon(weatherData.description)}
                  </div>

                  <p className="text-5xl font-bold text-green-700">
                    {weatherData.temp ?? '—'}°C
                  </p>

                  <p className="text-lg text-gray-600 mt-2 capitalize">
                    {weatherData.description}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    {formatObservationTime(
                      weatherData.observedAt,
                      weatherData.timezone
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                  <div className="text-2xl mb-2">💧</div>
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.humidity ?? '—'}%
                  </p>
                </div>

                <div className="card">
                  <div className="text-2xl mb-2">🌡️</div>
                  <p className="text-sm text-gray-500">Feels like</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.feelsLike ?? '—'}°C
                  </p>
                </div>

                <div className="card">
                  <div className="text-2xl mb-2">💨</div>
                  <p className="text-sm text-gray-500">Wind speed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.windSpeed ?? '—'} km/h
                  </p>
                </div>

                <div className="card">
                  <div className="text-2xl mb-2">🌧️</div>
                  <p className="text-sm text-gray-500">Precipitation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weatherData.precipitation ?? '—'} mm
                  </p>
                </div>
              </div>

              <div className="card bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🌦️</div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Precipitation probability
                    </h3>

                    {weatherData.rainProbability == null ? (
                      <p className="text-blue-800 mt-1">
                        Forecast probability is unavailable for this time.
                      </p>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-blue-700 mt-1">
                          {weatherData.rainProbability}%
                        </p>
                        <p className="text-sm text-blue-800 mt-1">
                          Forecast probability for the selected hour. This is a
                          forecast, not a measurement of current rainfall.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {weatherData.alerts?.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Farming advisories
                  </h3>
                  <div className="space-y-3">
                    {weatherData.alerts.map((alert, index) => (
                      <div
                        key={`${alert.event}-${index}`}
                        className={`p-4 rounded-lg border ${getAlertStyle(alert.severity)}`}
                      >
                        <p className="font-semibold">
                          {alert.severity === 'severe'
                            ? '🚨'
                            : '⚠️'}{' '}
                          {alert.event || 'Weather advisory'}
                        </p>
                        <p className="text-sm mt-1">
                          {alert.description || alert.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    These are automated advisories based on weather conditions,
                    not official government warnings.
                  </p>
                </div>
              ) : (
                <div className="card bg-gray-100 border border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    No generated farming advisories
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This does not guarantee that no official weather warnings
                    are active. Check your local meteorological authority for
                    official alerts.
                  </p>
                </div>
              )}
            </section>
          )}

          <section className="card mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to use
            </h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Choose Nashik or Mumbai, or enter your farm coordinates.</li>
              <li>• Select Get Live Weather to retrieve current conditions.</li>
              <li>• Review humidity, wind and precipitation before farm work.</li>
              <li>• Use forecasts as guidance, not a guarantee of local conditions.</li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}
