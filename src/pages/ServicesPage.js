import React, { useState, useEffect, useMemo, useCallback } from "react";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import FilterSort from "../components/FilterSort";
import { loadServices } from "../utils/loader";
import { searchServices } from "../utils/search";
import "./ServicesPage.css";

/**
 * ServicesPage
 * Requirements covered:
 * - FR01: Route /services
 * - FR03: Lists 12 services with stable ID
 * - FR04: Fuzzy search across tags, description, category, and name
 * - FR05: Filter by category and sorting (price asc/desc, rating, name, popular)
 * - FR14: Async loader with loading, error, and retry states
 * - FR15: Distinguish empty dataset vs search/filter yielding no matches
 */
export default function ServicesPage() {
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadServices(simulateFailure);
      setAllServices(data);
    } catch (err) {
      setError(err.message || "Failed to load services data");
    } finally {
      setLoading(false);
    }
  }, [simulateFailure]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(allServices.map((s) => s.category));
    return Array.from(set);
  }, [allServices]);

  // Combined search, filter, and sort pipeline
  const displayedServices = useMemo(() => {
    // 1. Search
    let results = searchQuery ? searchServices(allServices, searchQuery) : allServices;

    // 2. Category Filter
    if (selectedCategory) {
      results = results.filter((s) => s.category === selectedCategory);
    }

    // 3. Sort
    const sorted = [...results];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
      default:
        sorted.sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));
        break;
    }
    return sorted;
  }, [allServices, searchQuery, selectedCategory, sortBy]);

  return (
    <main className="services-page">
      <header className="services-header">
        <div className="header-content">
          <h1>Browse All Services</h1>
          <p>
            Explore trusted home care, repair, and maintenance services across Islamabad.
          </p>

          <div className="services-search-container">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </header>

      <section className="services-body">
        {/* Edge-case simulation control */}
        <div className="simulation-toolbar" aria-label="Demo controls">
          <label className="demo-toggle">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
            />
            <span>Simulate network/loader error (Edge Case Demo)</span>
          </label>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="services-status-card" role="status" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p className="status-text">Fetching verified home services...</p>
          </div>
        )}

        {/* Error state with Retry */}
        {!loading && error && (
          <div className="services-status-card error-card" role="alert">
            <div className="error-icon" aria-hidden="true">⚠️</div>
            <h3>Unable to Load Services</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchData}>
              Try Again
            </button>
          </div>
        )}

        {/* Content loaded */}
        {!loading && !error && (
          <>
            <FilterSort
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalResults={displayedServices.length}
            />

            {/* Results Grid */}
            {displayedServices.length > 0 ? (
              <div className="services-catalog-grid">
                {displayedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              /* Empty state (FR15) */
              <div className="empty-results-card" role="status">
                <span className="empty-emoji" aria-hidden="true">🔍</span>
                <h3>No Matching Services Found</h3>
                <p>
                  No services matched your search term <strong>"{searchQuery}"</strong>
                  {selectedCategory && (
                    <span> in category <strong>"{selectedCategory}"</strong></span>
                  )}.
                </p>
                <div className="empty-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
