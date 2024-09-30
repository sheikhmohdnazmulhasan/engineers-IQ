import emailjs from "emailjs-com";

import { encrypt } from "./text_encryptor";

async function sendAccountVerificationEmail(payload: { email: string; }) {
    const encryptedEmail = encrypt(payload.email);

    const TEMPLATE_PARAMS = {
        to_address: payload.email,
        verification_link: `http://localhost:3000/auth/verify/${encryptedEmail}`  // Use baseUrl for flexibility
    }

    try {
        const res = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
            TEMPLATE_PARAMS,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
        );

        return res;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return null;
    }
}

export default sendAccountVerificationEmail;
