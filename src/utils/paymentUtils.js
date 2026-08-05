/**
 * Payment & UPI Utility Functions
 */

/**
 * Generates a standard UPI deep link URL.
 * Spec: upi://pay?pa=UPI_ID&pn=HOLDER_NAME&am=FEE&tn=NOTE&cu=INR
 */
export function generateUpiUri({ upiId, name = 'BNI Conclave', amount = 0, note = 'Conclave Registration' }) {
  if (!upiId) return '';
  const cleanUpiId = String(upiId).trim();
  const encodedName = encodeURIComponent(String(name).trim());
  const encodedNote = encodeURIComponent(String(note).trim());
  const formattedAmount = Number(amount || 0).toFixed(2);

  return `upi://pay?pa=${cleanUpiId}&pn=${encodedName}&am=${formattedAmount}&tn=${encodedNote}&cu=INR`;
}

/**
 * Generates a high-quality QR code image URL for a given text/payload using public QR API.
 */
export function generateQrCodeUrl(text, size = 250) {
  if (!text) return '';
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodedText}`;
}

/**
 * Launches mobile UPI payment app (Google Pay / PhonePe / Paytm / BHIM) via deep link.
 */
export function triggerUpiPayment(upiUri) {
  if (!upiUri) return;
  window.location.href = upiUri;
}
