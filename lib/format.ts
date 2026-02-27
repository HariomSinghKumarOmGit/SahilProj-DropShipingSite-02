/**
 * Currency formatting utility for Indian Rupees (INR).
 *
 * Uses Intl.NumberFormat with the 'en-IN' locale so prices are formatted
 * with the ₹ symbol and Indian comma grouping (lakhs / crores).
 *
 * Examples:
 *   formatINR(1499)    → "₹1,499.00"
 *   formatINR(250000)  → "₹2,50,000.00"
 *   formatINR(99.5)    → "₹99.50"
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}

/**
 * Short‑form formatter (no decimals) — useful for chart axes, badges, etc.
 *
 * Examples:
 *   formatINRShort(1499) → "₹1,499"
 */
const inrShortFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatINRShort(amount: number): string {
  return inrShortFormatter.format(amount);
}
