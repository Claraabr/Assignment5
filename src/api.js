// Everything that talks to OpenWeatherMap lives here.
// No React in this file: it fetches data and returns plain objects.

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Vite reads the key from the .env file (variables must start with VITE_)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const UNIT_LABELS = {
  metric: { temp: '°C', wind: 'km/h' },
  imperial: { temp: '°F', wind: 'mph' },
};

// fetch only fails by itself when there is no connection,
// so we throw an error ourselves when the status is not ok
async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function loadWeather(city, units) {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('no-key');
  }

  const params = new URLSearchParams({ q: city, units: units, appid: API_KEY });

  const current = await getJSON(`${BASE_URL}/weather?${params}`);
  const forecast = await getJSON(`${BASE_URL}/forecast?${params}`);

  return {
    current: toCurrent(current, units),
    days: toDays(forecast),
  };
}

// API shape -> our shape, so the components only get what they need
function toCurrent(data, units) {
  const weather = data.weather[0];

  // metric gives the wind in m/s (we convert to km/h), imperial already gives mph
  let wind = data.wind.speed;
  if (units === 'metric') {
    wind = wind * 3.6;
  }

  return {
    name: `${data.name}, ${data.sys.country}`,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    wind: Math.round(wind),
    description: weather.description,
    icon: weather.icon,
  };
}

// The forecast has one entry every 3 hours.
// We keep the 12:00 entries to get one per day.
function toDays(data) {
  return data.list
    .filter((item) => item.dt_txt.includes('12:00:00'))
    .slice(0, 5)
    .map((item) => ({
      id: item.dt,
      day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));
}

export function iconUrl(code, size = '') {
  return `https://openweathermap.org/img/wn/${code}${size}.png`;
}

export function friendlyError(err, city) {
  if (err.message === 'no-key') {
    return 'API key missing: add your key in a .env file (see README).';
  }
  if (err.message === 'HTTP 404') {
    return `City "${city}" not found. Check the spelling.`;
  }
  if (err.message === 'HTTP 401') {
    return 'Invalid API key. Check .env (new keys can take up to 2 hours to work).';
  }
  if (err.message.startsWith('HTTP')) {
    return 'The weather service has a problem right now. Try again later.';
  }
  return "Couldn't reach the server. Check your internet connection.";
}
