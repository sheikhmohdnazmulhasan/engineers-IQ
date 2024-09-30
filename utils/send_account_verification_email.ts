import emailjs from "emailjs-com";

import { encrypt } from "./text_encryptor";

async function sendAccountVerificationEmail(payload: { email: string; }) {
    const validity = new Date(new Date().getTime() + 15 * 60000);

    const encryptedEmail = encrypt(`${payload.email}+++${validity}`);
    const origin = window.location.origin;

    const TEMPLATE_PARAMS = {
        to_address: payload.email,
        verification_link: `${origin}/auth/verify/${encryptedEmail}`
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
