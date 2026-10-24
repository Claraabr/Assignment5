import { useState } from 'react';

// returns an object with the errors (empty object = no errors)
function validate(text) {
  const errors = {};
  if (!text.trim()) {
    errors.city = 'Please enter a city name.';
  } else if (text.trim().length > 60) {
    errors.city = 'Keep it under 60 characters.';
  }
  return errors;
}

// Controlled form: the input always shows what's in state.
// It only tells App about a city once the value is valid.
export default function SearchBar({ onSearch, disabled }) {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setText(e.target.value);
    // if an error is showing, check again so it disappears as soon as it's fixed
    if (errors.city) {
      setErrors(validate(e.target.value));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(text);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSearch(text.trim());
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="search-row">
        <input
          name="city"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter a city (e.g. Beirut)"
          aria-invalid={!!errors.city}
        />
        <button type="submit" disabled={disabled}>
          {disabled ? 'Loading...' : 'Search'}
        </button>
      </div>

      {errors.city && <p className="field-error">{errors.city}</p>}
    </form>
  );
}
