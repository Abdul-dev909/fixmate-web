import React, { useState, useEffect } from "react";
import "./SearchBar.css";

/**
 * SearchBar Component
 * Addresses HomeGenie Issue #3:
 * Provides a responsive search input with debouncing and instant clear.
 * Accommodates vague, multi-word queries (e.g. "ac cleaning", "pipe leak", "fumigation")
 * which are matched across categories, names, tags, and service descriptions.
 */
export default function SearchBar({
  onSearch,
  placeholder = "Search services (e.g., 'ac cleaning', 'pipe leak', 'pest')...",
  initialValue = "",
}) {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(term);
    }, 250);

    return () => clearTimeout(handler);
  }, [term, onSearch]);

  const handleClear = () => {
    setTerm("");
    onSearch("");
  };

  return (
    <div className="search-bar-wrapper" role="search">
      <div className="search-input-box">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="search-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          aria-label="Search all services by name, tag, or description"
        />
        {term && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search input"
          >
            ✕
          </button>
        )}
      </div>
      <div className="search-chips" aria-label="Suggested quick searches">
        <span className="chips-label">Popular:</span>
        <button
          type="button"
          className="search-chip"
          onClick={() => {
            setTerm("ac cleaning");
            onSearch("ac cleaning");
          }}
        >
          AC Cleaning
        </button>
        <button
          type="button"
          className="search-chip"
          onClick={() => {
            setTerm("leak repair");
            onSearch("leak repair");
          }}
        >
          Leak Repair
        </button>
        <button
          type="button"
          className="search-chip"
          onClick={() => {
            setTerm("pest");
            onSearch("pest");
          }}
        >
          Pest Control
        </button>
      </div>
    </div>
  );
}
