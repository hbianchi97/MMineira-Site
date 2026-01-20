import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
    to: string | string[];
    subject: string;
    react: React.ReactElement;
}

export const sendEmail = async ({ to, subject, react }: EmailParams) => {
    if (!process.env.RESEND_API_KEY) {
        console.log("RESEND_API_KEY not found, skipping email.");
        return;
    }

    try {
        await resend.emails.send({
            from: "Menina Mineira <noreply@yourdomain.com>", // TODO: Replace with a verified domain on Resend
            to,
            subject,
            react,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};
