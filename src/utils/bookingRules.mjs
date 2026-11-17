/**
 * bookingRules.mjs — Business rules for FixMate.
 *
 * Rule 1 (Availability): Each time slot has a max number of bookings.
 * Rule 2 (Eligibility): Service area must match customer's sector.
 * Rule 3 (Pricing): Minimum order value must be met; orders above PKR 10,000 get free service fee.
 */

/**
 * Checks if a time slot is available for booking.
 * @param {object} availability — { maxBookingsPerSlot, currentBookings }
 * @param {string} slot — the chosen time slot
 * @returns {{ valid: boolean, message: string, remaining: number }}
 */
export function checkSlotAvailability(availability, slot) {
  if (!availability || !slot) {
    return { valid: false, message: "Slot or availability data is missing.", remaining: 0 };
  }
  const current = availability.currentBookings[slot];
  if (current === undefined) {
    return { valid: false, message: `Time slot "${slot}" does not exist.`, remaining: 0 };
  }
  const max = availability.maxBookingsPerSlot;
  const remaining = max - current;
  if (remaining <= 0) {
    return {
      valid: false,
      message: `This slot is fully booked (${max}/${max}). Please choose another time.`,
      remaining: 0,
    };
  }
  return {
    valid: true,
    message: `Slot available (${remaining} of ${max} remaining).`,
    remaining,
  };
}

/**
 * Checks if the service covers the customer's area/sector.
 * @param {string[]} areasCovered — sectors the service covers
 * @param {string} customerSector — customer's sector
 * @returns {{ valid: boolean, message: string }}
 */
export function checkAreaEligibility(areasCovered, customerSector) {
  if (!areasCovered || !customerSector) {
    return { valid: false, message: "Service area or customer sector is missing." };
  }
  const normalised = customerSector.trim().toUpperCase();
  const covered = areasCovered.map((a) => a.trim().toUpperCase());
  if (covered.includes(normalised)) {
    return { valid: true, message: `Service is available in ${customerSector}.` };
  }
  return {
    valid: false,
    message: `Sorry, this service does not cover ${customerSector}. Available areas: ${areasCovered.join(", ")}.`,
  };
}

/**
 * Calculates the total cost including service fee.
 * Orders above PKR 10,000 get free service fee.
 * @param {number} subtotal — sum of item prices × quantities
 * @param {number} serviceFeeRate — percentage as a decimal (e.g., 0.05 for 5%)
 * @returns {{ subtotal: number, serviceFee: number, total: number, freeServiceFee: boolean, message: string }}
 */
export function calculateTotal(subtotal, serviceFeeRate = 0.05) {
  if (typeof subtotal !== "number" || subtotal < 0) {
    return {
      subtotal: 0,
      serviceFee: 0,
      total: 0,
      freeServiceFee: false,
      message: "Invalid subtotal.",
    };
  }
  const FREE_THRESHOLD = 10000;
  const freeServiceFee = subtotal >= FREE_THRESHOLD;
  const serviceFee = freeServiceFee ? 0 : Math.round(subtotal * serviceFeeRate);
  const total = subtotal + serviceFee;
  const message = freeServiceFee
    ? `Order above PKR ${FREE_THRESHOLD.toLocaleString()} — service fee waived!`
    : `Service fee: PKR ${serviceFee.toLocaleString()} (${(serviceFeeRate * 100).toFixed(0)}%)`;
  return { subtotal, serviceFee, total, freeServiceFee, message };
}
