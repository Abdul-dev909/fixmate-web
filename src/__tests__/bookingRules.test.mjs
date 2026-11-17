import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  checkSlotAvailability,
  checkAreaEligibility,
  calculateTotal,
} from "../utils/bookingRules.mjs";

describe("Business Operating Rules Test Suite (Task 6.2)", () => {
  // RULE 1: Slot Availability Limits
  describe("Rule 1: Slot Availability (Capacity Limits)", () => {
    const mockAvailability = {
      slots: ["9:00 AM", "1:00 PM", "5:00 PM"],
      maxBookingsPerSlot: 4,
      currentBookings: {
        "9:00 AM": 2, // 2 left (valid)
        "1:00 PM": 3, // 1 left (boundary)
        "5:00 PM": 4, // 0 left (exceeded / full - breaks rule)
      },
    };

    test("Case 1 (Valid Input): Slot with open capacity returns valid=true and correct remaining count", () => {
      const result = checkSlotAvailability(mockAvailability, "9:00 AM");
      assert.equal(result.valid, true);
      assert.equal(result.remaining, 2);
      assert.match(result.message, /available/i);
    });

    test("Case 2 (Boundary Limit): Slot with exactly 1 spot remaining before saturation", () => {
      const result = checkSlotAvailability(mockAvailability, "1:00 PM");
      assert.equal(result.valid, true);
      assert.equal(result.remaining, 1);
      assert.match(result.message, /1 of 4 remaining/i);
    });

    test("Case 3 (Breaks Rule): Slot at full capacity (4/4 booked) returns valid=false", () => {
      const result = checkSlotAvailability(mockAvailability, "5:00 PM");
      assert.equal(result.valid, false);
      assert.equal(result.remaining, 0);
      assert.match(result.message, /fully booked/i);
    });

    test("Case 4 (Edge Case): Non-existent slot returns valid=false", () => {
      const result = checkSlotAvailability(mockAvailability, "11:00 PM");
      assert.equal(result.valid, false);
      assert.match(result.message, /does not exist/i);
    });
  });

  // RULE 2: Geographic Service Area Eligibility
  describe("Rule 2: Geographic Service Area Eligibility", () => {
    const coveredAreas = ["F-6", "F-7", "F-8", "G-6", "I-8"];

    test("Case 1 (Valid Area): Customer in covered sector returns valid=true", () => {
      const result = checkAreaEligibility(coveredAreas, "F-7");
      assert.equal(result.valid, true);
      assert.match(result.message, /available in F-7/i);
    });

    test("Case 2 (Case Insensitive Match): Sector input matches regardless of lowercase/whitespace", () => {
      const result = checkAreaEligibility(coveredAreas, "  f-6  ");
      assert.equal(result.valid, true);
    });

    test("Case 3 (Breaks Rule): Customer outside covered sectors returns valid=false", () => {
      const result = checkAreaEligibility(coveredAreas, "Bahria Town");
      assert.equal(result.valid, false);
      assert.match(result.message, /does not cover Bahria Town/i);
    });
  });

  // RULE 3: Pricing & Fee Waiver Threshold
  describe("Rule 3: Pricing & Service Fee Waiver Threshold (PKR 10,000)", () => {
    test("Case 1 (Standard Order < 10,000): Applies standard 5% service fee", () => {
      const subtotal = 5000;
      const result = calculateTotal(subtotal, 0.05);
      assert.equal(result.subtotal, 5000);
      assert.equal(result.serviceFee, 250);
      assert.equal(result.total, 5250);
      assert.equal(result.freeServiceFee, false);
    });

    test("Case 2 (Boundary Limit == 10,000): Exactly PKR 10,000 qualifies for fee waiver (fee = 0)", () => {
      const subtotal = 10000;
      const result = calculateTotal(subtotal, 0.05);
      assert.equal(result.subtotal, 10000);
      assert.equal(result.serviceFee, 0);
      assert.equal(result.total, 10000);
      assert.equal(result.freeServiceFee, true);
    });

    test("Case 3 (Breaks Threshold > 10,000): PKR 15,000 qualifies for fee waiver", () => {
      const subtotal = 15000;
      const result = calculateTotal(subtotal, 0.05);
      assert.equal(result.serviceFee, 0);
      assert.equal(result.total, 15000);
      assert.equal(result.freeServiceFee, true);
    });

    test("Case 4 (Edge Case - Negative Input): Returns zeroed out safe fallback", () => {
      const result = calculateTotal(-500);
      assert.equal(result.total, 0);
      assert.equal(result.freeServiceFee, false);
    });
  });
});
