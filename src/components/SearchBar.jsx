import { useState } from 'react';

const MAX_LENGTH = 60;
// letters from any language, spaces and . , ' -  (e.g. "Saint-Étienne", "Paris, FR")
const CITY_PATTERN = /^[\p{L}\s.,'-]+$/u;

// returns an error message, or '' when the value is fine
function validate(text) {
  const value = text.trim();
  if (value === '') return 'Please enter a city name.';
  if (value.length > MAX_LENGTH) return `Keep it under ${MAX_LENGTH} characters.`;
  if (!CITY_PATTERN.test(value)) return 'Use letters only (spaces, commas and hyphens are fine).';
  return '';
}

// Controlled form: the input always shows what's in state.
// It only tells App about a city once the value is valid.
export default function SearchBar({ onSearch, disabled }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const value = e.target.value;
    setText(value);
    // once an error is showing, check again on each keystroke so it clears as soon as it's fixed
    if (error) setError(validate(value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(text);
    setError(found);
    if (found) return;
    onSearch(text.trim());
  }

  return (
    <form className="search" onSubmit={handleSubmit} noValidate>
      <label htmlFor="city-input" className="visually-hidden">City</label>
      <div className="search-row">
        <input
          id="city-input"
          name="city"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter a city (e.g. Beirut)"
          autoComplete="off"
          aria-invalid={error !== ''}
          aria-describedby={error ? 'city-error' : undefined}
        />
        <button type="submit" disabled={disabled}>
          {disabled ? 'Loading...' : 'Search'}
        </button>
      </div>
      {error && (
        <p id="city-error" className="field-error">
          {error}
        </p>
      )}
    </form>
  );
}
