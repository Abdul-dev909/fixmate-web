import React from "react";
import "./FilterSort.css";

/**
 * FilterSort Component
 * Enables category filtering and sorting (Price, Rating, Popularity, Name)
 * Works concurrently with fuzzy search (FR05)
 */
export default function FilterSort({
  categories = [],
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults = 0,
}) {
  return (
    <div className="filter-sort-bar" role="region" aria-label="Filters and Sorting">
      <div className="filter-item">
        <label htmlFor="category-select" className="filter-label">
          Category
        </label>
        <select
          id="category-select"
          className="select-control"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="sort-select" className="filter-label">
          Sort by
        </label>
        <select
          id="sort-select"
          className="select-control"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name (A to Z)</option>
        </select>
      </div>

      <div className="results-counter" aria-live="polite">
        Showing <strong>{totalResults}</strong> service{totalResults === 1 ? "" : "s"}
      </div>
    </div>
  );
}
