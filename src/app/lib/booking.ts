// Single source of truth for the booking / contact CTAs.
// Swap BOOKING_URL here only — every CTA imports from this file.
export const BOOKING_URL = "https://calendly.com/siddhantbadola5/30min";
export const BOOKING_EMAIL = "siddhant@dissid.ca";
export const BOOKING_MAILTO = `mailto:${BOOKING_EMAIL}?subject=Hiring%20Inquiry`;

// Contact form posts here. This is a static export (no Next API routes), so the
// form POSTs directly to the dis-sid Cloud Function (CORS already allows dissid.ai).
export const CONTACT_ENDPOINT =
  "https://us-central1-dis-sid.cloudfunctions.net/contact";
