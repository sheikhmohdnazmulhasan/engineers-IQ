import emailjs from "emailjs-com";

const SERVICE_ID = "service_6q2mlgc";
const PUBLIC_KEY = "f8-NuZZSnWNj4M3eS";
const TEMPLATE_ID = "template_woxpdzz";

async function sendEmailForNewLead(TEMPLATE_PARAMS) {
    try {
        const res = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            TEMPLATE_PARAMS,
            PUBLIC_KEY
        );

        return res;
    } catch (error) {
        console.log(error);

        return null;
    }
}

export default sendEmailForNewLead;