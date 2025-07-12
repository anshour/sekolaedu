import { email } from "zod/v4";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import config from "~/config";
import PasswordResetEmail from "~/templates/email/password-reset-email";
import WelcomeEmail from "~/templates/email/welcome-email";

/**
 * Interface for email options
 */
interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
    contentType?: string;
  }>;
}

/**
 * Class for handling email operations with nodemailer
 */
class EmailService {
  private transporter: Transporter;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.fromEmail = config.emailFrom!;
    this.fromName = config.emailFromName || "SekolaEdu";

    // Create transporter based on email service
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost!,
      port: parseInt(config.smtpPort || "587"),
      secure: config.smtpSecure, // true for 465, false for other ports
      auth: {
        user: config.smtpUser!,
        pass: config.smtpPassword!,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  /**
   * Verifies the SMTP connection
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log("Email service connected successfully");
    } catch (error) {
      console.error("Email service connection failed:", error);
    }
  }

  /**
   * Sends an email
   * @param options - Email options including recipient, subject, and content
   * @returns Promise with message info
   */
  async sendEmail(options: EmailOptions): Promise<any> {
    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Sends a welcome email to new users
   * @param to - Recipient email address
   * @param userName - User's name
   * @returns Promise with message info
   */
  async sendWelcomeEmail(
    to: string,
    userName: string,
    credentials: {
      password: string;
      email: string;
    },
  ): Promise<any> {
    const subject = "Welcome to SekolaEdu - Your Account is Ready!";
    const loginUrl = config.frontendUrl + "/auth/login";
    const html = await render(
      WelcomeEmail({
        userName,
        email: credentials.email,
        password: credentials.password,
        loginUrl,
      }),
    );
    const text = `Welcome to SekolaEdu, ${userName}! Your initial password is: ${credentials.password}. Login at: ${loginUrl || "/auth/login"}`;

    return await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Sends a password reset email
   * @param to - Recipient email address
   * @param resetToken - Password reset token
   * @param resetUrl - Password reset URL
   * @returns Promise with message info
   */
  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<any> {
    const subject = "Password Reset Request";
    const html = await render(
      PasswordResetEmail({ resetLink: resetUrl, userName: "Example" }),
    );
    const text = `Password reset requested. Visit: ${resetUrl}`;

    return await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Sends a verification email
   * @param to - Recipient email address
   * @param verificationToken - Email verification token
   * @param verificationUrl - Email verification URL
   * @returns Promise with message info
   */
  async sendVerificationEmail(
    to: string,
    verificationToken: string,
    verificationUrl: string,
  ): Promise<any> {
    const subject = "Verify Your Email Address";
    const html = `
      <h1>Verify Your Email Address</h1>
      <p>Please verify your email address to complete your registration.</p>
      <p>Click the link below to verify:</p>
      <a href="${verificationUrl}?token=${verificationToken}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;
    const text = `Verify your email: ${verificationUrl}?token=${verificationToken}`;

    return await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Sends a notification email
   * @param to - Recipient email address
   * @param title - Notification title
   * @param message - Notification message
   * @returns Promise with message info
   */
  async sendNotificationEmail(
    to: string,
    title: string,
    message: string,
  ): Promise<any> {
    const subject = `Notification: ${title}`;
    const html = `
      <h1>${title}</h1>
      <p>${message}</p>
      <p>Best regards,<br>SekolaEdu Team</p>
    `;

    return await this.sendEmail({ to, subject, html, text: message });
  }
}

// Export a singleton instance
export default new EmailService();
