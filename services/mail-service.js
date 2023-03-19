const nodemailer = require('nodemailer')

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
            subject: 'Account activation on ' + process.env.API_URL,
            text: '',
            html:
                `<div>
                    <h1>Follow the link to activate</h1>
                    <a href = "${link}">${link}</a>
                </div>`
        })
    }

    async sendPasswordChangedMail(to) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Changing password on ' + process.env.API_URL,
            text: '',
            html:
                `<div>
                    <h1>Your password was succesfully changed!</h1>
                </div>`
        })
    }
}
module.exports = new MailService()