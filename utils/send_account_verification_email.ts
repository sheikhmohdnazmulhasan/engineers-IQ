import emailjs from "emailjs-com";
import jwt from 'jsonwebtoken';

async function sendAccountVerificationEmail(payload: { email: string; name: string }) {

    const jwtToken = jwt.sign(payload,
        process.env.JWT_SECRET_FOR_ACCOUNT_VERIFICATION as string,
        { expiresIn: '1h' }
    );

    try {
        const res = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID as string,
            process.env.TEMPLATE_ID as string,
            TEMPLATE_PARAMS,
            process.env.EMAILJS_PUBLIC_KEY as string
        );

        return res;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export default sendAccountVerificationEmail;