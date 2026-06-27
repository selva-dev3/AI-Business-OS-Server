import nodemailer from 'nodemailer';
interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}
declare const sendEmail: ({ to, subject, html, from }: SendEmailParams) => Promise<nodemailer.SentMessageInfo>;
declare const sendOTPEmail: (email: string, otp: string) => Promise<nodemailer.SentMessageInfo>;
declare const sendInvitationEmail: (email: string, companyName: string, inviterName: string) => Promise<nodemailer.SentMessageInfo>;
declare const sendPasswordResetEmail: (email: string, newPassword: string) => Promise<nodemailer.SentMessageInfo>;
export { sendEmail, sendOTPEmail, sendInvitationEmail, sendPasswordResetEmail };
//# sourceMappingURL=emailService.d.ts.map