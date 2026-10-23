import { useEffect, useState } from 'react';
import { loadWeather, friendlyError, UNIT_LABELS } from './api.js';
import Card from './components/Card.jsx';
import SearchBar from './components/SearchBar.jsx';
import UnitToggle from './components/UnitToggle.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import Forecast from './components/Forecast.jsx';

const STORAGE_KEY = 'weather-react:last-city';

// localStorage can throw (private mode, blocked storage), so it's wrapped
function readSavedCity() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export default function App() {
  // App owns the state that several components need (lifting state up)
  const [city, setCity] = useState(readSavedCity); // the last searched city (the query)
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [weather, setWeather] = useState(null); // { current, days }
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0); // bumped to fetch again (Retry, same city)

  // Effect 1: fetch the weather whenever the city, the units or reloadKey change
  useEffect(() => {
    if (city === '') return; // nothing searched yet: stay idle

    let ignore = false; // set to true if a newer request starts before this one ends

    async function load() {
      setStatus('loading');
      try {
        const data = await loadWeather(city, units);
        if (ignore) return;
        setWeather({ ...data, query: city }); // keep the city this data belongs to
        setStatus('success');
      } catch (err) {
        if (ignore) return;
        setErrorMessage(friendlyError(err, city));
        setStatus('error');
      }
    }

    load();

    // cleanup: runs before the next fetch starts, so an old answer can't overwrite a new one
    return () => {
      ignore = true;
    };
  }, [city, units, reloadKey]);

  // Effect 2: remember the last city that worked, so a refresh shows it again.
  // It depends on weather (not city): weather only changes when a fetch succeeds,
  // so a misspelled city is never saved.
  useEffect(() => {
    if (!weather) return;
    try {
      localStorage.setItem(STORAGE_KEY, weather.query);
    } catch {
      // storage blocked: the app still works, it just won't remember
    }
  }, [weather]);

  function handleSearch(newCity) {
    setCity(newCity);
    // also bump the key so searching the same city again still refreshes it
    setReloadKey((k) => k + 1);
  }

  function handleRetry() {
    setReloadKey((k) => k + 1);
  }

  const labels = UNIT_LABELS[units];
  const message = status === 'loading' ? `Loading weather for ${city}...` : errorMessage;

  return (
    <main className="container">
      <header className="top-bar">
        <h1>Weather Dashboard</h1>
        <UnitToggle units={units} onChange={setUnits} />
      </header>

      <SearchBar onSearch={handleSearch} disabled={status === 'loading'} />

      <StatusMessage status={status} message={message} onRetry={handleRetry} />

      {status === 'success' && weather && (
        <div className="results">
          <Card title={weather.current.city}>
            <WeatherCard weather={weather.current} labels={labels} />
          </Card>

          <Card title="5-day forecast">
            <Forecast days={weather.days} unit={labels.temp} />
          </Card>
        </div>
      )}
    </main>
  );
}
