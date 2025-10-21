const crypto = require('crypto');

const SECRET_KEY = Buffer.from(process.env.CRYPTO_SECRET, 'hex');

const criptografar = () => {
    const iv =  crypto.randomBytes(16);
    const cifrador = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}


const descriptografar = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decifrador = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
    let decrypted = decifrador.update(encrypted, 'hex', 'utf8');
    decrypted += decifrador.final('utf8');
    return decrypted;
}

module.exports = { criptografar, descriptografar };