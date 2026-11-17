/**
 * loader.js — Async mock loader for services data.
 * Simulates network delay and can simulate failure for edge-case testing.
 */
import servicesData from "../data/services";

const SIMULATED_DELAY = 800; // ms

/**
 * Loads services with a simulated async delay.
 * Pass simulateError=true to test error/retry states.
 */
export async function loadServices(simulateError = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error("Failed to load services. Please check your connection and try again."));
      } else {
        resolve([...servicesData]);
      }
    }, SIMULATED_DELAY);
  });
}
