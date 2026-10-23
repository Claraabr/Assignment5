const OPTIONS = [
  { value: 'metric', label: '°C' },
  { value: 'imperial', label: '°F' },
];

// Doesn't own any state: it shows the units App gives it and asks App to change them.
export default function UnitToggle({ units, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Units">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={units === option.value ? 'active' : ''}
          aria-pressed={units === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
