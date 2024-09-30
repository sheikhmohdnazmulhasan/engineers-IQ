import emailjs from "emailjs-com";
import jwt from 'jsonwebtoken';

async function sendAccountVerificationEmail(payload: { email: string; }) {
    const jwtToken = jwt.sign(
        { email: payload.email },
        process.env.NEXT_PUBLIC_JWT_SECRET_FOR_ACCOUNT_VERIFICATION as string,
        { expiresIn: '1h' }
    );

    // Use environment variable for the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const TEMPLATE_PARAMS = {
        to_address: payload.email,
        verification_link: `${baseUrl}/verify/${jwtToken}`  // Use baseUrl for flexibility
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
