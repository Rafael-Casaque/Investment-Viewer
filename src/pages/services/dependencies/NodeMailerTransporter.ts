import { ISendEmail } from "@/pages/repositories/interfaces/ISendEmail";
import nodemailer from "nodemailer";

type Auth = {
  user: string;
  pass: string;
};

export class NodeMailerTransporter implements ISendEmail {
  service: string;
  auth: Auth;
  constructor(service: string, auth: Auth) {
    this.service = service;
    this.auth = auth;
  }

  async send(to: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: this.service,
      auth: this.auth,
    });

    const mailOptions = {
      from: this.auth.user,
      to,
      subject: "e-mail de recuperação de senha",
      html: `${code}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Erro ao enviar email: ${error}`);
      throw new Error(`Erro ao enviar email: ${error}`);
    }
  }
}
