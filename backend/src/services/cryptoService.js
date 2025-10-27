const crypto = require('crypto');

const SECRET_KEY = Buffer.from(process.env.CRYPTO_SECRET, 'hex');


function isCriptografada(msg) {
  if (typeof msg !== "string") return false;
  const parts = msg.split(":");
  if (parts.length !== 2) return false;
  const [iv, encrypted] = parts;
  // Verifica se são hexadecimais válidos
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(iv) && hexRegex.test(encrypted);
}

const criptografar = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};



const descriptografar = (encryptedText) => {
  //verificar se realmente está criptografada
  if (!isCriptografada(encryptedText)) return encryptedText;

  const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decifrador = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
    let decrypted = decifrador.update(encrypted, 'hex', 'utf8');
    decrypted += decifrador.final('utf8');
    return decrypted;
}



module.exports = { criptografar, descriptografar, isCriptografada };