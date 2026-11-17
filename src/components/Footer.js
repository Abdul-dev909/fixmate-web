import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span aria-hidden="true">🛠️</span> FixMate Islamabad
          </div>
          <p className="footer-tagline">
            Professional &amp; verified on-demand home services in Islamabad, Pakistan.
          </p>
        </div>

        <div className="footer-info">
          <h4>Service Sectors</h4>
          <p>F-6, F-7, F-8, F-10, F-11, G-6, G-7, G-8, G-9, G-10, I-8, I-10, E-7, E-11</p>
        </div>

        <div className="footer-meta">
          <p className="academic-badge">
            CS4032 Web Programming — Assignment 02
          </p>
          <p>Student: <strong>Abdul Rehman</strong> | Roll No: <strong>24i-2092</strong></p>
          <p className="simulation-notice">
            Notice: This is a fictional simulated application built for academic assessment.
          </p>
        </div>
      </div>
    </footer>
  );
}
