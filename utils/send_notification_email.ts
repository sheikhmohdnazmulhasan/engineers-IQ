import emailjs from "emailjs-com";

import { INotificationEmail } from "@/interface/email.notification.interface";

async function sendNotificationEmail(TEMPLATE_PARAMS: INotificationEmail) {

    try {
        const res = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NOTIFICATION as string,
            TEMPLATE_PARAMS,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
        );

        return res;
    } catch (error) {
        return null;
    }
}

export default sendNotificationEmail;
