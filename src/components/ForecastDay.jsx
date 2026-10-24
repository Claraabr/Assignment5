import { iconUrl } from '../api.js';

// One day in the forecast list.
export default function ForecastDay({ day, unit }) {
  return (
    <li className="forecast-day">
      <p className="day-name">{day.day}</p>
      <img src={iconUrl(day.icon)} alt={day.description} />
      <p>
        {day.temp}
        {unit}
      </p>
    </li>
  );
}
