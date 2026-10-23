import { iconUrl } from '../api.js';

// One day in the forecast list.
export default function ForecastDay({ day, unit }) {
  return (
    <li className="forecast-day">
      <p className="day-name">{day.day}</p>
      <img src={iconUrl(day.icon)} alt={day.description} width="50" height="50" />
      <p className="day-temp">
        {day.temp}
        {unit}
      </p>
    </li>
  );
}
