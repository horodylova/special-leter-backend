const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key_must_be_changed';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

function encryptText(text) {
  try {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHM, 
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), 
      iv
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt letter text');
  }
}

module.exports = { encryptText };