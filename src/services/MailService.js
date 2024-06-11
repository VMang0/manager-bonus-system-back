import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html:
            `
              <div>
                <h1>Для активации перейдите по ссылке и пройдите регистрацию</h1>
                <a href='${link}'>${link}'</a>
              </div>
            `
    })
  }

  async sendVerifyInfo(to) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Верификация аккаунта!',
      text: '',
      html:
        `
              <div>
                 <h1>Менеджер подтвердил ваш аккаунт! Используйте свой пароль и логин для авторизации в системе</h1>
                <a href='${process.env.CLIENT_URL}'>${process.env.CLIENT_URL}'</a>
              </div>
            `
    })
  }
}

export default new MailService();