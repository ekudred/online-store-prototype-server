const nodemailer = require('nodemailer')

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        refreshToken: process.env.REFRESH_TOKEN,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
    })

    this.subscription()
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта в Online Store Prototype',
      text: '',
      html: `
                  <div>
                      <h1>Для активации перейдите по ссылке <a href="${link}">Online Store</a></h1>
                  </div>
              `,
    })
  }

  subscription() {
    this.transporter.on('token', token => {
      console.log('A new access token was generated')
      console.log('User: %s', token.user)
      console.log('Access Token: %s', token.accessToken)
      console.log('Expires: %s', new Date(token.expires))
    })
  }
}

module.exports = new MailService()
