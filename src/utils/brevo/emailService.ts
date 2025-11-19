import { brevoTransporter } from "./brevoMailer";

export async function sendVerificationEmail(to:string, code:string) {
    try {
        const result = await brevoTransporter.sendMail({
            from: '"Datafy Technologies" <no-reply@datafy.ng>',
            to,
            subject: "Your Verification Code",
            html: `
            <p>Your verification code is:</p>
            <h2>${code}</h2>
            <p>This code expires in 10 minutes.</p>
            `,
        });
        return { status: "success", result };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { status: "failure", error };
    }
  
}
