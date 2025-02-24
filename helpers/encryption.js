const crypto = require('crypto');

function generateEncryptionKey(letterId, deliveryDate) {
  const dateStr = deliveryDate instanceof Date 
    ? deliveryDate.toISOString() 
    : String(deliveryDate);
  
  const keyString = `letter-${letterId}-delivery-${dateStr}`;
  
  return crypto.createHash('sha256').update(keyString).digest();
}

function encryptLetterText(text, key) {
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return iv.toString('hex') + ':' + encrypted;
}

function decryptLetterText(encryptedText, key) {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Failed to decrypt letter text');
  }
}

function isLetterReadable(deliveryDate) {
  if (!deliveryDate) return false;
  
  const now = new Date();
  const delivery = new Date(deliveryDate);
  
  return now >= delivery;
}

module.exports = {
  generateEncryptionKey,
  encryptLetterText,
  decryptLetterText,
  isLetterReadable
};