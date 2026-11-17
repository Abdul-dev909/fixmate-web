import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateTotal, checkAreaEligibility } from "../utils/bookingRules.mjs";
import servicesData from "../data/services";
import "./CheckoutPage.css";

/**
 * CheckoutPage
 * Features:
 * - Controlled form inputs (FR09)
 * - Validation rules with specific feedback (FR10)
 * - Sector coverage compatibility across all cart items (Rule 2)
 * - Calculated order summary sidebar (FR11)
 * - Direct navigation to confirmation with payload (FR16)
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getSubtotal } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    sector: "F-7",
    streetAddress: "",
    specialInstructions: "",
    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const calculation = calculateTotal(subtotal);

  // If cart is empty, redirect or display warning
  if (cartItems.length === 0) {
    return (
      <main className="checkout-container">
        <div className="checkout-empty-notice" role="alert">
          <h2>No Items to Checkout</h2>
          <p>Your cart is empty. Please select a service before checking out.</p>
          <Link to="/services" className="btn btn-primary">
            Return to Services
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Controlled update without mutating state
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Rule 1: Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters long.";
    }

    // Rule 2: Pakistani Phone number regex (0300-1234567 or 03001234567)
    const phoneRegex = /^(03\d{2}[-]?\d{7})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required for dispatch confirmation.";
    } else if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ""))) {
      newErrors.phone = "Enter a valid Pakistani mobile number (e.g. 0312-3456789 or 03001234567).";
    }

    // Rule 3: Detailed Street Address
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Full street address is required for service personnel.";
    } else if (formData.streetAddress.trim().length < 10) {
      newErrors.streetAddress = "Please provide house/street number and landmarks (min 10 characters).";
    }

    // Rule 4: Business Rule 2 check across all items in cart
    for (const item of cartItems) {
      const originalService = servicesData.find((s) => s.id === item.serviceId);
      if (originalService) {
        const areaCheck = checkAreaEligibility(originalService.areasCovered, formData.sector);
        if (!areaCheck.valid) {
          newErrors.sector = `The service "${item.name}" does not operate in Sector ${formData.sector}.`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Generate random booking ID
    const bookingId = "FXM-" + Math.floor(100000 + Math.random() * 900000);

    const bookingPayload = {
      bookingId,
      customer: { ...formData },
      items: [...cartItems],
      calculation: { ...calculation },
      createdAt: new Date().toISOString(),
    };

    // Navigate to confirmation page passing state
    setTimeout(() => {
      navigate("/confirmation", { state: { booking: bookingPayload } });
    }, 400);
  };

  return (
    <main className="checkout-container">
      <div className="checkout-header">
        <h1>Schedule &amp; Book Service</h1>
        <p>Complete your appointment details. No payment required until work is done.</p>
      </div>

      <div className="checkout-grid">
        {/* Left column: Controlled Form (FR09, FR10) */}
        <section className="checkout-form-section">
          <form onSubmit={handleSubmit} noValidate className="checkout-form">
            <div className="form-card">
              <h3>1. Contact &amp; Customer Information</h3>

              <div className="form-field">
                <label htmlFor="fullName" className="field-label">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`input-text ${errors.fullName ? "input-error" : ""}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ali Ahmed"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
                {errors.fullName && (
                  <span id="fullName-error" className="error-text" role="alert">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="phone" className="field-label">
                  Mobile Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`input-text ${errors.phone ? "input-error" : ""}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                <span className="field-hint">Used for SMS slot confirmation and technician coordination</span>
                {errors.phone && (
                  <span id="phone-error" className="error-text" role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="form-card">
              <h3>2. Service Location &amp; Scheduling</h3>

              <div className="form-field">
                <label htmlFor="sector" className="field-label">
                  Islamabad Sector <span className="req">*</span>
                </label>
                <select
                  id="sector"
                  name="sector"
                  className={`select-control ${errors.sector ? "input-error" : ""}`}
                  value={formData.sector}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.sector)}
                  aria-describedby={errors.sector ? "sector-error" : undefined}
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
                  <option value="Bahria Town">Bahria Town (Outside coverage)</option>
                </select>
                {errors.sector && (
                  <span id="sector-error" className="error-text" role="alert">
                    {errors.sector}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="preferredDate" className="field-label">
                  Service Date <span className="req">*</span>
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  className="input-text"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-field">
                <label htmlFor="streetAddress" className="field-label">
                  Complete Street Address <span className="req">*</span>
                </label>
                <textarea
                  id="streetAddress"
                  name="streetAddress"
                  rows="3"
                  className={`input-textarea ${errors.streetAddress ? "input-error" : ""}`}
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="House #, Street #, Sector/Sub-sector, Landmark..."
                  aria-invalid={Boolean(errors.streetAddress)}
                  aria-describedby={errors.streetAddress ? "streetAddress-error" : undefined}
                ></textarea>
                {errors.streetAddress && (
                  <span id="streetAddress-error" className="error-text" role="alert">
                    {errors.streetAddress}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="specialInstructions" className="field-label">
                  Special Instructions / Gate Entry Notes (Optional)
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows="2"
                  className="input-textarea"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Ring doorbell twice, watch out for dog, bring long ladder..."
                ></textarea>
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn btn-primary btn-submit-order"
                disabled={submitting}
              >
                {submitting ? "Confirming Booking..." : "Confirm & Finalize Booking ✓"}
              </button>
            </div>
          </form>
        </section>

        {/* Right column: Order Summary */}
        <aside className="checkout-summary-section" aria-label="Order Summary">
          <div className="checkout-summary-card">
            <h3>Booking Review</h3>

            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div
                  key={`${item.serviceId}-${item.slot}`}
                  className="checkout-item-row"
                >
                  <div className="item-badge">{item.image}</div>
                  <div className="item-details">
                    <strong>{item.name}</strong>
                    <div className="item-subdetails">
                      <span>{item.quantity}x @ PKR {item.price.toLocaleString()}</span>
                      <span>• {item.slot}</span>
                    </div>
                  </div>
                  <div className="item-line-total">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-calc-breakdown">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>PKR {calculation.subtotal.toLocaleString()}</span>
              </div>
              <div className="calc-row">
                <span>
                  Service Fee (5%)
                  {calculation.freeServiceFee && <span className="free-tag">Free!</span>}
                </span>
                <span>
                  {calculation.freeServiceFee
                    ? "PKR 0"
                    : `PKR ${calculation.serviceFee.toLocaleString()}`}
                </span>
              </div>
              <div className="calc-row grand-total-row">
                <strong>Total Payable</strong>
                <strong className="grand-price">PKR {calculation.total.toLocaleString()}</strong>
              </div>
            </div>

            <div className="payment-notice-box">
              <span className="notice-icon" aria-hidden="true">💵</span>
              <p>
                <strong>Cash on Service Delivery:</strong> Pay our verified technician in cash or bank transfer only after service completion and your total satisfaction.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
