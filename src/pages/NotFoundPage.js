import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <main className="not-found-container">
      <div className="not-found-card" role="alert">
        <span className="not-found-code">404</span>
        <h2>Page Not Found</h2>
        <p>
          The page or route you are looking for doesn't exist or has been relocated.
        </p>
        <div className="not-found-links">
          <Link to="/" className="btn btn-primary">
            Back to Homepage
          </Link>
          <Link to="/services" className="btn btn-secondary">
            Browse All Services
          </Link>
        </div>
      </div>
    </main>
  );
}
