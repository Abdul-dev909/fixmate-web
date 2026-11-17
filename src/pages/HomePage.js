import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import { loadServices } from "../utils/loader";
import { searchServices } from "../utils/search";
import "./HomePage.css";

/**
 * HomePage — landing page with hero, search, featured services.
 */
export default function HomePage() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadServices(simulateError);
      setServices(data);
      setFiltered(data.filter((s) => s.popular));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [simulateError]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFiltered(services.filter((s) => s.popular));
      } else {
        setFiltered(searchServices(services, query));
      }
    },
    [services]
  );

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero" aria-label="Welcome banner">
        <div className="hero-content">
          <h1 className="hero-title">
            Home Services,{" "}
            <span className="hero-highlight">Done Right</span>
          </h1>
          <p className="hero-subtitle">
            Book trusted professionals for cleaning, repairs, renovations, and
            more — all across Islamabad.
          </p>
          <SearchBar onSearch={handleSearch} />
          {searchQuery && (
            <p className="search-results-info" role="status" aria-live="polite">
              {filtered.length > 0
                ? `Found ${filtered.length} service${filtered.length !== 1 ? "s" : ""} for "${searchQuery}"`
                : `No services match "${searchQuery}". Try different keywords or `}
              {filtered.length === 0 && (
                <Link to="/services" className="browse-link">
                  browse all services
                </Link>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Demo control for simulating load error (edge case) */}
      <div className="demo-control">
        <label className="demo-label">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
          />
          <span>Simulate loading failure (demo)</span>
        </label>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-state" role="status" aria-label="Loading services">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      )}

      {/* Error state with retry */}
      {error && (
        <div className="error-state" role="alert">
          <p className="error-message">⚠️ {error}</p>
          <button className="btn btn-primary" onClick={fetchServices}>
            Retry
          </button>
        </div>
      )}

      {/* Featured / search results */}
      {!loading && !error && (
        <section className="featured-section" aria-label="Services">
          <h2 className="section-title">
            {searchQuery ? "Search Results" : "Popular Services"}
          </h2>

          {filtered.length > 0 ? (
            <div className="services-grid">
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="empty-state" role="status">
              <p className="empty-title">No services found</p>
              <p className="empty-message">
                Try adjusting your search terms, or{" "}
                <Link to="/services">browse all services</Link>.
              </p>
            </div>
          )}

          {!searchQuery && (
            <div className="cta-section">
              <Link to="/services" className="btn btn-primary btn-large">
                Browse All Services →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* How it works */}
      <section className="how-it-works" aria-label="How FixMate works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Browse & Search</h3>
            <p>Find the service you need using our smart search.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Pick a Time Slot</h3>
            <p>Choose an available slot that works for you.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Fill Your Details</h3>
            <p>Provide your address and contact information.</p>
          </div>
          <div className="step-card">
            <span className="step-number">4</span>
            <h3>Confirm & Done!</h3>
            <p>Review your order and get a confirmation.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
