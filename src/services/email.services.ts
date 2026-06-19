import nodemailer from "nodemailer";

const emailConfig = {
  user: "vishmi@fedolab.com",
  pass: "Vishmi!@#",
};

export class EmailService {
  static async sendVerificationEmail(email: string, verificationCode: string): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
      });

      const mailOptions = {
        from: `"Real Smart Global" <${emailConfig.user}>`,
        to: email,
        subject: "Verify Your Email Address",
        text: `Please use the following verification code to verify your account: ${verificationCode}`,
        html: `<p>Please use the following verification code to verify your account:</p><h2>${verificationCode}</h2>`,
      };

      const response = await transporter.sendMail(mailOptions);

      return response?.accepted?.length > 0;
    } catch (error) {
      console.log("Failed to send email:", error);
      return false;
    }
  }
}
