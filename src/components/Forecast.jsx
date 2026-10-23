import ForecastDay from './ForecastDay.jsx';

export default function Forecast({ days, unit }) {
  if (days.length === 0) {
    return <p>No forecast available for this city.</p>;
  }

  return (
    <ul className="forecast">
      {days.map((day) => (
        <ForecastDay key={day.id} day={day} unit={unit} />
      ))}
    </ul>
  );
}
