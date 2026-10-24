import { iconUrl } from '../api.js';

// Current weather. Only reads props, no state of its own.
export default function WeatherCard({ weather, labels }) {
  return (
    <div className="current">
      <img src={iconUrl(weather.icon, '@2x')} alt={weather.description} />
      <p className="temperature">
        {weather.temp}
        {labels.temp}
      </p>
      <p className="description">{weather.description}</p>

      <ul className="details">
        <li>
          Feels like <strong>{weather.feelsLike}{labels.temp}</strong>
        </li>
        <li>
          Humidity <strong>{weather.humidity}%</strong>
        </li>
        <li>
          Wind <strong>{weather.wind} {labels.wind}</strong>
        </li>
      </ul>
    </div>
  );
}
