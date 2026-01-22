import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailParams {
    to: string | string[];
    subject: string;
    react: React.ReactElement;
}

export const sendEmail = async ({ to, subject, react }: EmailParams) => {
    if (!resend) {
        console.log("RESEND_API_KEY not found or Resend not initialized, skipping email.");
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
