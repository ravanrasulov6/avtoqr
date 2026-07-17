/**
 * Generates a pre-filled WhatsApp click-to-chat link.
 * 
 * @param {string} phoneNumber - Driver's phone number.
 * @param {string} carPlate - Car plate number.
 * @returns {string} - Full WhatsApp URL.
 */
export function generateWhatsAppLink(phoneNumber, carPlate) {
  if (!phoneNumber) return '';
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const text = `Salam, ${carPlate || 'avtomobiliniz'} nömrəli avtomobiliniz yolu kəsir. Zəhmət olmasa yaxınlaşardınız.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Masks a phone number for user privacy.
 * E.g., "+994 50 123 45 67" -> "+994 50 *** ** 67"
 * 
 * @param {string} phoneNumber - Driver's phone number.
 * @returns {string} - Masked phone number.
 */
export function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.trim();
  
  // If too short, just return masked
  if (cleaned.length < 5) return '***';

  const hasPlus = cleaned.startsWith('+');
  
  // Standard masking for +994 50 123 45 67 style numbers
  // Keep start (+994 50 or first few chars) and end (last 2 digits)
  const prefixLength = hasPlus ? 7 : 4; // e.g. "+994 50" (7 chars) or "050" (3-4 chars)
  const suffixLength = 2; // last 2 digits
  
  if (cleaned.length <= prefixLength + suffixLength) {
    return cleaned.slice(0, prefixLength) + '*'.repeat(cleaned.length - prefixLength);
  }
  
  const start = cleaned.slice(0, prefixLength);
  const end = cleaned.slice(-suffixLength);
  const middle = cleaned.slice(prefixLength, -suffixLength);
  
  // Mask only numbers in the middle, keep spaces/hyphens for formatting readability
  const maskedMiddle = middle.replace(/\d/g, '*');
  
  return `${start}${maskedMiddle}${end}`;
}
