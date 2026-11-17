import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateTotal } from "../utils/bookingRules.mjs";
import "./CartPage.css";

/**
 * CartPage
 * Manages active bookings, quantity modifications, item removal,
 * and displays the calculated summary adhering to Rule 3.
 */
export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
  } = useCart();

  const subtotal = getSubtotal();
  const count = getItemCount();

  // Rule 3: 5% service fee waived above PKR 10,000
  const calculation = calculateTotal(subtotal);

  if (cartItems.length === 0) {
    return (
      <main className="cart-page-container">
        <div className="cart-empty-card" role="status">
          <span className="cart-empty-icon" aria-hidden="true">🛒</span>
          <h2>Your Booking Cart is Empty</h2>
          <p>
            You haven't selected any home services yet. Browse our verified technicians,
            cleaners, and handymen across Islamabad.
          </p>
          <Link to="/services" className="btn btn-primary cart-browse-btn">
            Browse All Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page-container">
      <div className="cart-header-row">
        <div>
          <h1>Your Booking Cart</h1>
          <p className="cart-subtitle">
            Review your selected services and appointment slots ({count} item{count === 1 ? "" : "s"})
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary clear-cart-btn"
          onClick={clearCart}
          title="Remove all items from your cart"
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* Items List */}
        <section className="cart-items-section" aria-label="Selected Services">
          {cartItems.map((item) => (
            <article
              key={`${item.serviceId}-${item.slot}`}
              className="cart-item-card"
            >
              <div className="cart-item-emoji" aria-hidden="true">
                {item.image}
              </div>

              <div className="cart-item-info">
                <div className="item-title-row">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <button
                    type="button"
                    className="item-remove-btn"
                    onClick={() => removeFromCart(item.serviceId, item.slot)}
                    aria-label={`Remove ${item.name} for ${item.slot} from cart`}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>

                <div className="cart-item-meta">
                  <span className="item-provider">Provider: <strong>{item.provider}</strong></span>
                  <span className="item-slot">Slot: <strong>{item.slot}</strong></span>
                </div>

                <div className="cart-item-bottom">
                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.serviceId, item.slot, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-number" aria-label={`Quantity: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.serviceId, item.slot, item.quantity + 1)}
                      disabled={item.quantity >= 6}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-pricing">
                    <span className="unit-price">
                      PKR {item.price.toLocaleString()} /{item.unit.replace("per ", "")}
                    </span>
                    <strong className="item-total-price">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Order Summary Sidebar (FR11, FR12) */}
        <aside className="cart-summary-sidebar" aria-label="Booking Price Summary">
          <div className="summary-card">
            <h3>Calculated Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Total Items</span>
                <span>{count} unit{count === 1 ? "" : "s"}</span>
              </div>

              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>PKR {calculation.subtotal.toLocaleString()}</span>
              </div>

              {/* Rule 3 condition display */}
              <div className="summary-row">
                <span>
                  Service Fee (5%)
                  {calculation.freeServiceFee && (
                    <span className="fee-waived-pill">Waived!</span>
                  )}
                </span>
                <span className={calculation.freeServiceFee ? "fee-waived-text" : ""}>
                  {calculation.freeServiceFee
                    ? "FREE"
                    : `PKR ${calculation.serviceFee.toLocaleString()}`}
                </span>
              </div>

              {/* Rule 3 incentive notification */}
              <div
                className={`rule3-banner ${
                  calculation.freeServiceFee ? "banner-qualified" : "banner-reminder"
                }`}
              >
                {calculation.freeServiceFee ? (
                  <span>🎉 Orders over PKR 10,000 enjoy 100% free service fees!</span>
                ) : (
                  <span>
                    💡 Add PKR {(10000 - calculation.subtotal).toLocaleString()} more to waive the 5% platform fee!
                  </span>
                )}
              </div>

              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span className="total-amount">
                  PKR {calculation.total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <Link to="/services" className="btn btn-secondary btn-block continue-btn">
              ← Add More Services
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
