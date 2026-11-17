import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ServiceCard.css";

/**
 * ServiceCard Component
 * Displays service details including transparent provider info
 * Directly addresses HomeGenie Issue #2:
 * Provider details (Name, Experience, Verified status, Contact) are clearly shown
 * and clicking on the service opens the detailed profile view with provider availability.
 */
export default function ServiceCard({ service }) {
  const { isInCart } = useCart();
  const alreadyInCart = isInCart(service.id);

  // Available slots count
  const availableSlotCount = service.availability.slots.filter((slot) => {
    const booked = service.availability.currentBookings[slot] || 0;
    return booked < service.availability.maxBookingsPerSlot;
  }).length;

  return (
    <article className="service-card" aria-labelledby={`svc-${service.id}-title`}>
      <div className="card-top">
        <span className="service-emoji" role="img" aria-label={service.name}>
          {service.image}
        </span>
        <span className="service-category">{service.category}</span>
      </div>

      <div className="card-content">
        <div className="title-rating-row">
          <h3 id={`svc-${service.id}-title`} className="service-title">
            <Link to={`/services/${service.id}`} className="title-link">
              {service.name}
            </Link>
          </h3>
          <div className="service-rating" aria-label={`Rated ${service.rating} out of 5 stars`}>
            ⭐ <span>{service.rating}</span>
            <small className="review-count">({service.reviewCount})</small>
          </div>
        </div>

        <p className="service-desc">{service.shortDescription}</p>

        {/* HomeGenie Issue #2 Fix: Clear Provider Info on Card */}
        <div className="provider-badge-box">
          <div className="provider-main">
            <span className="provider-role-label">Provider:</span>
            <span className="provider-name">{service.provider.name}</span>
            {service.provider.verified && (
              <span className="verified-pill" title="Verified Professional Partner">
                ✓ Verified
              </span>
            )}
          </div>
          <span className="provider-exp">{service.provider.experience} field experience</span>
        </div>

        <div className="service-meta">
          <div className="service-price">
            <span className="currency">PKR</span>
            <span className="amount">{service.price.toLocaleString()}</span>
            <span className="unit">/{service.unit.replace("per ", "")}</span>
          </div>

          <div className="slot-indicator">
            {availableSlotCount > 0 ? (
              <span className="status-badge status-available">
                ● {availableSlotCount} Slots Today
              </span>
            ) : (
              <span className="status-badge status-full">
                ● Fully Booked
              </span>
            )}
          </div>
        </div>

        <div className="card-action-row">
          <Link
            to={`/services/${service.id}`}
            className="btn btn-primary card-btn"
            aria-label={`View full details and book ${service.name}`}
          >
            View Details &amp; Book
          </Link>
          {alreadyInCart && (
            <span className="card-incart-indicator" title="Service selected in your cart">
              ✓ In Cart
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
