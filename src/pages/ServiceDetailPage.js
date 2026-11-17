import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { loadServices } from "../utils/loader";
import { checkSlotAvailability, checkAreaEligibility } from "../utils/bookingRules.mjs";
import "./ServiceDetailPage.css";

/**
 * ServiceDetailPage
 * Displays full service details, provider profile (Issue #2 fix),
 * slot availability checks (Rule 1), sector eligibility (Rule 2),
 * and booking quantity selector with numerical constraints.
 */
export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form / booking selections
  const [selectedSlot, setSelectedSlot] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userSector, setUserSector] = useState("F-7");
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchService = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await loadServices(false);
      const found = all.find((item) => item.id === id);
      if (!found) {
        setError(`No service found with ID "${id}". It may have been removed or the URL is incorrect.`);
      } else {
        setService(found);
        // Pre-select first available slot if any
        const firstAvailable = found.availability.slots.find((s) => {
          const booked = found.availability.currentBookings[s] || 0;
          return booked < found.availability.maxBookingsPerSlot;
        });
        if (firstAvailable) setSelectedSlot(firstAvailable);
      }
    } catch (err) {
      setError(err.message || "Failed to load service details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Check Rule 1: Slot Availability
  const slotStatus = service && selectedSlot
    ? checkSlotAvailability(service.availability, selectedSlot)
    : null;

  // Check Rule 2: Sector Eligibility
  const areaStatus = service && userSector
    ? checkAreaEligibility(service.areasCovered, userSector)
    : null;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      // Numerical boundary: 1 to 6 units
      if (next < 1) return 1;
      if (next > 6) return 6;
      return next;
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!service) return;

    if (!selectedSlot) {
      setFeedbackMessage({ type: "error", text: "Please select an appointment time slot." });
      return;
    }

    if (slotStatus && !slotStatus.valid) {
      setFeedbackMessage({ type: "error", text: slotStatus.message });
      return;
    }

    if (areaStatus && !areaStatus.valid) {
      setFeedbackMessage({ type: "error", text: areaStatus.message });
      return;
    }

    addToCart(service, selectedSlot, quantity);
    setFeedbackMessage({
      type: "success",
      text: `Added ${quantity}x "${service.name}" for ${selectedSlot} to your cart!`,
    });
  };

  if (loading) {
    return (
      <main className="detail-page-container">
        <div className="detail-status-card" role="status">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Loading service details...</p>
        </div>
      </main>
    );
  }

  // Invalid ID or error (FR02)
  if (error || !service) {
    return (
      <main className="detail-page-container">
        <div className="detail-status-card error-card" role="alert">
          <div className="error-icon" aria-hidden="true">🔍</div>
          <h2>Service Not Found</h2>
          <p>{error || "The requested service could not be located."}</p>
          <div className="detail-error-actions">
            <Link to="/services" className="btn btn-primary">
              ← Return to All Services
            </Link>
            <Link to="/" className="btn btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const alreadyAdded = isInCart(service.id);

  return (
    <main className="detail-page-container">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/services">Services</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{service.name}</li>
        </ol>
      </nav>

      <div className="detail-grid">
        {/* Left Column: Service & Provider Info */}
        <section className="detail-main-info" aria-label="Service Information">
          <div className="detail-header-card">
            <div className="detail-top-meta">
              <span className="detail-emoji" role="img" aria-label={service.name}>
                {service.image}
              </span>
              <div>
                <span className="detail-category">{service.category}</span>
                <h1 className="detail-title">{service.name}</h1>
                <div className="detail-rating-row">
                  <span className="rating-stars" aria-label={`Rating: ${service.rating} out of 5`}>
                    ⭐ {service.rating}
                  </span>
                  <span className="detail-review-count">
                    ({service.reviewCount} customer reviews)
                  </span>
                  <span className="detail-duration">⏱️ {service.duration}</span>
                </div>
              </div>
            </div>

            <div className="detail-desc-block">
              <h3>Service Overview</h3>
              <p>{service.description}</p>
            </div>
          </div>

          {/* HOMEGENIE ISSUE #2 FIX: Full Provider Profile */}
          <div className="provider-profile-card" aria-label="Assigned Service Provider">
            <div className="provider-card-header">
              <span className="provider-avatar-icon" aria-hidden="true">👤</span>
              <div>
                <div className="provider-name-row">
                  <h3>{service.provider.name}</h3>
                  {service.provider.verified && (
                    <span className="verified-tag">✓ Verified Partner</span>
                  )}
                </div>
                <p className="provider-subtitle">
                  {service.provider.experience} professional field experience
                </p>
              </div>
            </div>

            <div className="provider-details-grid">
              <div className="provider-detail-item">
                <span className="detail-label">Direct Helpline:</span>
                <span className="detail-val">{service.provider.phone}</span>
              </div>
              <div className="provider-detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-val text-success">● On Duty &amp; Available</span>
              </div>
              <div className="provider-detail-item">
                <span className="detail-label">Quality Assurance:</span>
                <span className="detail-val">Guaranteed post-service warranty</span>
              </div>
            </div>
          </div>

          {/* Coverage Areas */}
          <div className="coverage-card">
            <h3>Covered Islamabad Sectors</h3>
            <p className="coverage-subtitle">
              This service is actively deployed in the following sectors:
            </p>
            <div className="coverage-tags-list">
              {service.areasCovered.map((sector) => (
                <span
                  key={sector}
                  className={`sector-tag ${sector === userSector ? "sector-tag-active" : ""}`}
                >
                  Sector {sector}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Booking Configuration Form (FR07, FR11, FR12) */}
        <aside className="detail-booking-sidebar" aria-label="Booking Options">
          <div className="booking-card">
            <div className="booking-price-header">
              <div className="price-display">
                <span className="price-currency">PKR</span>
                <span className="price-num">{service.price.toLocaleString()}</span>
                <span className="price-unit">/{service.unit.replace("per ", "")}</span>
              </div>
              <span className="vat-notice">Inclusive of equipment &amp; labor</span>
            </div>

            <form onSubmit={handleAddToCart} className="booking-form">
              {/* Rule 2: Sector check */}
              <div className="form-group">
                <label htmlFor="sector-select" className="form-label">
                  1. Your Islamabad Sector:
                </label>
                <select
                  id="sector-select"
                  className="form-select"
                  value={userSector}
                  onChange={(e) => {
                    setUserSector(e.target.value);
                    setFeedbackMessage(null);
                  }}
                >
                  <option value="F-6">Sector F-6</option>
                  <option value="F-7">Sector F-7</option>
                  <option value="F-8">Sector F-8</option>
                  <option value="F-10">Sector F-10</option>
                  <option value="F-11">Sector F-11</option>
                  <option value="G-6">Sector G-6</option>
                  <option value="G-7">Sector G-7</option>
                  <option value="G-8">Sector G-8</option>
                  <option value="G-9">Sector G-9</option>
                  <option value="G-10">Sector G-10</option>
                  <option value="I-8">Sector I-8</option>
                  <option value="I-10">Sector I-10</option>
                  <option value="I-14">Sector I-14</option>
                  <option value="E-7">Sector E-7</option>
                  <option value="E-11">Sector E-11</option>
                  <option value="H-8">Sector H-8</option>
                  <option value="H-9">Sector H-9</option>
                  <option value="Bahria Town">Bahria Town (Outside core)</option>
                </select>

                {areaStatus && (
                  <p
                    className={`rule-message ${
                      areaStatus.valid ? "rule-success" : "rule-error"
                    }`}
                    role="alert"
                  >
                    {areaStatus.valid ? "✓ " : "✕ "}
                    {areaStatus.message}
                  </p>
                )}
              </div>

              {/* Rule 1: Time Slot Selection */}
              <div className="form-group">
                <label className="form-label">
                  2. Choose Appointment Slot:
                </label>
                <div className="slots-grid" role="radiogroup" aria-label="Appointment Slots">
                  {service.availability.slots.map((slot) => {
                    const booked = service.availability.currentBookings[slot] || 0;
                    const max = service.availability.maxBookingsPerSlot;
                    const isFull = booked >= max;
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isFull}
                        className={`slot-pill ${isSelected ? "slot-selected" : ""} ${
                          isFull ? "slot-disabled" : ""
                        }`}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setFeedbackMessage(null);
                        }}
                      >
                        <span className="slot-time">{slot}</span>
                        <span className="slot-capacity">
                          {isFull ? "Fully Booked" : `${max - booked} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {slotStatus && (
                  <p
                    className={`rule-message ${
                      slotStatus.valid ? "rule-info" : "rule-error"
                    }`}
                  >
                    {slotStatus.valid ? "ℹ " : "✕ "}
                    {slotStatus.message}
                  </p>
                )}
              </div>

              {/* Quantity Selector with 1 to 6 boundary */}
              <div className="form-group">
                <label htmlFor="booking-qty" className="form-label">
                  3. Quantity / Units: (Limit: 1 - 6)
                </label>
                <div className="quantity-controller">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span id="booking-qty" className="qty-value" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 6}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <span className="qty-unit-label">
                    {quantity === 1 ? service.unit.replace("per ", "") : `${service.unit.replace("per ", "")}s`}
                  </span>
                </div>
              </div>

              {/* Subtotal Calculation */}
              <div className="sidebar-subtotal-row">
                <span>Calculated Item Subtotal:</span>
                <strong>PKR {(service.price * quantity).toLocaleString()}</strong>
              </div>

              {/* Feedback Alert */}
              {feedbackMessage && (
                <div
                  className={`feedback-banner banner-${feedbackMessage.type}`}
                  role="status"
                >
                  {feedbackMessage.text}
                </div>
              )}

              {/* Action Buttons */}
              <div className="booking-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={Boolean(!areaStatus?.valid || !slotStatus?.valid)}
                >
                  Add to Cart
                </button>

                {alreadyAdded && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => navigate("/cart")}
                  >
                    View in Cart →
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}
