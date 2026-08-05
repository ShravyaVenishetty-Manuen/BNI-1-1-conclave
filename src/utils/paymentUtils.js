/**
 * Payment & UPI Utility Functions
 */

/**
 * Generates a standard UPI deep link URL.
 * Spec: upi://pay?pa=UPI_ID&pn=HOLDER_NAME&am=FEE&tn=NOTE&cu=INR
 */
export function generateUpiUri({ upiId, name = 'BNI Conclave', amount = 0, note = 'Conclave Registration' }) {
  if (!upiId) return '';
  const cleanUpiId = String(upiId).trim().replace(/\s+/g, '');
  // NPCI spec requires raw clean payee name without URL encoding (%20) inside the QR payload
  const cleanName = String(name || 'BNI Conclave').replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'BNI Conclave';
  const numAmount = Number(amount || 0);

  let uri = `upi://pay?pa=${cleanUpiId}&pn=${cleanName}&cu=INR`;
  if (numAmount > 0) {
    uri += `&am=${numAmount}`;
  }
  return uri;
}

/**
 * Generates a high-quality QR code image URL for a given text/payload using public QR API.
 */
export function generateQrCodeUrl(text, size = 300) {
  if (!text) return '';
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=M&margin=2&data=${encodedText}`;
}

/**
 * Launches mobile UPI payment app (Google Pay / PhonePe / Paytm / BHIM) via deep link.
 */
export function triggerUpiPayment(upiUri) {
  if (!upiUri) return;
  window.location.href = upiUri;
}
