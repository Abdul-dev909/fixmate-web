import React, { useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ConfirmationPage.css";

/**
 * ConfirmationPage
 * Final confirmation screen showing:
 * - Order reference number
 * - Schedule details
 * - Itemised summary
 * - Customer contact and address
 * - Clears cart upon arrival
 */
export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  const booking = location.state?.booking;

  // Clear cart once when booking payload exists
  useEffect(() => {
    if (booking && !clearedRef.current) {
      clearCart();
      clearedRef.current = true;
    }
  }, [booking, clearCart]);

  if (!booking) {
    return (
      <main className="confirmation-container">
        <div className="confirmation-card no-booking-card">
          <span className="no-booking-icon" aria-hidden="true">📋</span>
          <h2>No Active Confirmation</h2>
          <p>
            It looks like you navigated here directly without placing a booking.
          </p>
          <div className="confirmation-actions">
            <Link to="/services" className="btn btn-primary">
              Browse Available Services
            </Link>
            <Link to="/" className="btn btn-secondary">
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { bookingId, customer, items, calculation, createdAt } = booking;
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="confirmation-container">
      <div className="confirmation-card">
        {/* Success Header */}
        <div className="confirmation-header">
          <div className="success-badge-icon" aria-hidden="true">✓</div>
          <h1>Booking Successfully Confirmed!</h1>
          <p className="confirmation-ref">
            Booking Reference: <strong>#{bookingId}</strong>
          </p>
          <p className="confirmation-timestamp">Confirmed on {formattedDate}</p>
        </div>

        {/* Customer & Location Details */}
        <section className="confirmation-section" aria-label="Customer & Location Details">
          <h3>Customer &amp; Dispatch Details</h3>
          <div className="details-two-col">
            <div>
              <span className="field-title">Customer Name:</span>
              <p className="field-val">{customer.fullName}</p>
            </div>
            <div>
              <span className="field-title">Contact Number:</span>
              <p className="field-val">{customer.phone}</p>
            </div>
            <div>
              <span className="field-title">Service Sector:</span>
              <p className="field-val">Sector {customer.sector}, Islamabad</p>
            </div>
            <div>
              <span className="field-title">Service Date:</span>
              <p className="field-val">{customer.preferredDate}</p>
            </div>
            <div className="full-col">
              <span className="field-title">Full Address:</span>
              <p className="field-val">{customer.streetAddress}</p>
            </div>
            {customer.specialInstructions && (
              <div className="full-col">
                <span className="field-title">Special Notes:</span>
                <p className="field-val italic-val">"{customer.specialInstructions}"</p>
              </div>
            )}
          </div>
        </section>

        {/* Booked Services Summary */}
        <section className="confirmation-section" aria-label="Booked Services">
          <h3>Scheduled Services</h3>
          <div className="confirmed-items-list">
            {items.map((item) => (
              <div
                key={`${item.serviceId}-${item.slot}`}
                className="confirmed-item-row"
              >
                <div className="confirmed-item-main">
                  <span className="confirmed-emoji">{item.image}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <div className="confirmed-sub">
                      <span>Provider: {item.provider}</span>
                      <span>Slot: {item.slot}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="confirmed-item-price">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Summary */}
        <section className="confirmation-section payment-section" aria-label="Payment Summary">
          <h3>Financial Breakdown</h3>
          <div className="calc-summary-block">
            <div className="calc-item">
              <span>Items Subtotal</span>
              <span>PKR {calculation.subtotal.toLocaleString()}</span>
            </div>
            <div className="calc-item">
              <span>Platform Service Fee</span>
              <span>
                {calculation.freeServiceFee
                  ? "PKR 0 (Free Service Waiver)"
                  : `PKR ${calculation.serviceFee.toLocaleString()}`}
              </span>
            </div>
            <div className="calc-item total-item">
              <strong>Grand Total Payable</strong>
              <strong className="grand-val">PKR {calculation.total.toLocaleString()}</strong>
            </div>
          </div>
          <div className="payment-method-alert">
            <span>💵 Payment Mode: <strong>Cash / Transfer on Service Delivery</strong></span>
          </div>
        </section>

        {/* Academic Simulation Notice */}
        <div className="academic-disclaimer">
          <small>
            ⚠️ <em>Notice: FixMate is an academic simulation project for CS4032 Web Programming Assignment 02. No actual technician has been scheduled or billed.</em>
          </small>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/services")}
          >
            Explore More Services
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            Print / Save Receipt
          </button>
          <Link to="/" className="btn btn-secondary">
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
