import { useEffect, useState } from 'react';
import { loadWeather, friendlyError, UNIT_LABELS } from './api.js';
import Card from './components/Card.jsx';
import SearchBar from './components/SearchBar.jsx';
import UnitToggle from './components/UnitToggle.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import Forecast from './components/Forecast.jsx';

const STORAGE_KEY = 'lastCity';

export default function App() {
  // App owns the state that several components need (lifting state up)
  const [city, setCity] = useState(localStorage.getItem(STORAGE_KEY) || ''); // last searched city
  const [units, setUnits] = useState('metric'); // 'metric' (°C) or 'imperial' (°F)
  const [weather, setWeather] = useState(null); // the data from the API
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // fetches the weather and puts the result in state
  async function load(cityName, unitsName) {
    setStatus('loading');
    try {
      const data = await loadWeather(cityName, unitsName);
      setWeather({ ...data, searchedCity: cityName }); // also keep which city this data is for
      setStatus('success');
    } catch (err) {
      setErrorMessage(friendlyError(err, cityName));
      setStatus('error');
    }
  }

  // Effect 1: fetch the weather when the page opens and whenever the city or the units change
  useEffect(() => {
    if (city === '') return; // nothing searched yet: stay idle
    load(city, units);
  }, [city, units]);

  // Effect 2: save the last city that worked, so a refresh shows it again.
  // weather only changes when a fetch succeeds, so a wrong city is never saved.
  useEffect(() => {
    if (weather === null) return;
    localStorage.setItem(STORAGE_KEY, weather.searchedCity);
  }, [weather]);

  function handleSearch(newCity) {
    if (newCity === city) {
      load(city, units); // same city: city doesn't change so the effect won't run, we fetch ourselves
    } else {
      setCity(newCity); // new city: effect 1 fetches it
    }
  }

  function handleRetry() {
    load(city, units);
  }

  const labels = UNIT_LABELS[units];
  const isLoading = status === 'loading';

  let message = errorMessage;
  if (isLoading) {
    message = `Loading weather for ${city}...`;
  }

  return (
    <main className="container">
      <header className="top-bar">
        <h1>Weather Dashboard</h1>
        <UnitToggle units={units} onChange={setUnits} disabled={isLoading} />
      </header>

      <SearchBar onSearch={handleSearch} disabled={isLoading} />

      <StatusMessage status={status} message={message} onRetry={handleRetry} />

      {status === 'success' && (
        <div className="results">
          <Card title={weather.current.name}>
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
