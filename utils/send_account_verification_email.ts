import emailjs from "emailjs-com";
import jwt from 'jsonwebtoken';

const SERVICE_ID = "service_6q2mlgc";
const PUBLIC_KEY = "f8-NuZZSnWNj4M3eS";
const TEMPLATE_ID = "template_woxpdzz";

async function sendAccountVerificationEmail(payload: { email: string; name: string }) {

    const jwtToken = jwt.sign(payload,
        process.env.JWT_SECRET_FOR_ACCOUNT_VERIFICATION as string,
        { expiresIn: '1h' }
    );

    // try {
    //     const res = await emailjs.send(
    //         SERVICE_ID,
    //         TEMPLATE_ID,
    //         TEMPLATE_PARAMS,
    //         PUBLIC_KEY
    //     );

    //     return res;
    // } catch (error) {
    //     console.log(error);

    //     return null;
    // }
}

export default sendAccountVerificationEmail;