import { Service } from 'typedi';
import nodemailer from 'nodemailer';
import { MAIL_FROM, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from '@/config';

@Service()
export default class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });
  }

  public sendEmail(to: string, subject: string, html: string): void {
    this.transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      html,
    });
  }
}
