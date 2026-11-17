import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

/**
 * Navbar component
 * Features:
 * - Brand logo & link
 * - Direct navigation (Home, Services, Cart)
 * - Dynamic cart count badge updated via CartContext
 * - Active route styling using useLocation
 * - Full Dark/Light theme toggle fixing HomeGenie Issue #1
 */
export default function Navbar() {
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const itemCount = getItemCount();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="FixMate Homepage">
          <span className="logo-icon" aria-hidden="true">🛠️</span>
          <span className="logo-text">FixMate</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`nav-link ${isActive("/services") ? "active" : ""}`}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={`nav-link cart-link ${isActive("/cart") ? "active" : ""}`}
              aria-label={`Cart with ${itemCount} items`}
            >
              <span className="cart-icon" aria-hidden="true">🛒</span>
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="cart-badge" aria-label={`${itemCount} items in cart`}>
                  {itemCount}
                </span>
              )}
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}
