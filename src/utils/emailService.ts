import nodemailer from 'nodemailer';
import env from '../config/env';
import logger from '../config/logger';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, from = env.smtp.from }: SendEmailParams): Promise<nodemailer.SentMessageInfo> => {
  try {
    const t = getTransporter();
    const info = await t.sendMail({ from, to, subject, html });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

const sendOTPEmail = async (email: string, otp: string): Promise<nodemailer.SentMessageInfo> => {
  return sendEmail({
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
  });
};

const sendInvitationEmail = async (email: string, companyName: string, inviterName: string): Promise<nodemailer.SentMessageInfo> => {
  return sendEmail({
    to: email,
    subject: `You've been invited to ${companyName}`,
    html: `<p>${inviterName} has invited you to join ${companyName}.</p><p>Click <a href="${process.env['APP_URL'] || 'http://localhost:3000'}/auth/accept-invite?email=${email}">here</a> to accept the invitation.</p>`,
  });
};

const sendPasswordResetEmail = async (email: string, newPassword: string): Promise<nodemailer.SentMessageInfo> => {
  return sendEmail({
    to: email,
    subject: 'Password Reset Successful',
    html: `<p>Your password has been reset by an administrator.</p><p>Your temporary password is: <strong>${newPassword}</strong></p><p>Please change it on your next login.</p>`,
  });
};

export { sendEmail, sendOTPEmail, sendInvitationEmail, sendPasswordResetEmail };
