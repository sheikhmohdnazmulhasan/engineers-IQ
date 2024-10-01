import emailjs from "emailjs-com";

async function sendNotificationEmail(TEMPLATE_PARAMS) {

    try {
        const res = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
            TEMPLATE_PARAMS,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
        );

        return res;
    } catch (error) {
        return null;
    }
}

export default sendNotificationEmail;
