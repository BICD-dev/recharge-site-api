import SibApiV3Sdk from "sib-api-v3-sdk";

// Configure the client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // store your key in .env

const emailClient = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      to: [{ email: to }],
      templateId: 1, // Replace with your Brevo email template ID
      params: {
        verification_code: code,
      },
      subject: "Your Verification Code",
      sender: { name: "Datafy Technologies", email: "no-reply@datafy.com" },
    });

    const result = await emailClient.sendTransacEmail(sendSmtpEmail);
    return { status: "success", result };
  } catch (error) {
    console.error("Email send error:", error);
    return { status: "failure", error };
  }
};
