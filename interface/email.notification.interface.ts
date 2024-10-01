export interface INotificationEmail {
    subject: string;
    receiver_name: string;
    description: string;
    receiver_email: string;
    [key: string]: unknown;
}
