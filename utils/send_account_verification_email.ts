import emailjs from "emailjs-com";
import jwt from 'jsonwebtoken';

async function sendAccountVerificationEmail(payload: { email: string; name: string }) {

    const jwtToken = jwt.sign(payload,
        process.env.JWT_SECRET_FOR_ACCOUNT_VERIFICATION as string,
        { expiresIn: '1h' }
    );

    const TEMPLATE_PARAMS = {
        name: payload.name,
        to_address: payload.email,
        // TODO: replace the origin after deployment
        verification_link: `http://localhost:3000` + `/verify/${jwtToken}`
    }

    try {
        const res = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID as string,
            process.env.EMAILJS_TEMPLATE_ID as string,
            TEMPLATE_PARAMS,
            process.env.EMAILJS_PUBLIC_KEY as string
        );

        return res;
    } catch (error) {
        console.log('from email utils,', error);

        return null;
    }
}

export default sendAccountVerificationEmail;