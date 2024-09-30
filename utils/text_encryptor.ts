import CryptoJS from 'crypto-js';

// Secret key
const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_FOR_ACCOUNT_VERIFICATION as string;

// Encrypt function
export function encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decrypt function
export function decrypt(cipherText: string) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Usage
// const encryptedEmail = encrypt('user@example.com');
// console.log('Encrypted Email:', encryptedEmail);

// const decryptedEmail = decrypt(encryptedEmail);
// console.log('Decrypted Email:', decryptedEmail);
