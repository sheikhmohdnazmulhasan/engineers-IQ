import CryptoJS from 'crypto-js';

// Secret key
const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_FOR_ACCOUNT_VERIFICATION as string;

// Base64 URL encode
function base64UrlEncode(str: string) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Base64 URL decode
function base64UrlDecode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
    }
    return output;
}

// Encrypt function
export function encrypt(text: string) {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
    return base64UrlEncode(encrypted);
}

// Decrypt function
export function decrypt(cipherText: string) {
    const decodedCipherText = base64UrlDecode(cipherText);
    const bytes = CryptoJS.AES.decrypt(decodedCipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
