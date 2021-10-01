const nodemailer = require('nodemailer');
const conf = require('./../../config');

const host =conf.mail.host;
const port = conf.mail.port;
const user = conf.mail.user;
const pass = conf.mail.pass;
const from = conf.mail.from;

class Mail {

    constructor(phost=host,pport=port,puser=user,ppass=pass) {
       
        this.transporter = this.getTransporter(phost,pport,puser,ppass);
    }

    getTransporter (phost=host,pport=port,puser=user,ppass=pass) {
        console.log({phost,pport,puser,ppass});
        const transporter = nodemailer.createTransport({
            host: phost,
            port: pport,
            secure: pport ==465?true:false,
            auth: {
                user: puser,
                pass: ppass,
            },
        });
        return transporter;
    }
    sendEmail = async (email, subject, html,pfrom=from) => {
        try {
            await this.transporter.sendMail({
                from: `<${pfrom}>`,
                to: email,
                subject: subject,
                html:html
            });
            console.log("email sent sucessfully");
        } catch (error) {
            console.log(error, "email not sent");
        }
    };
}

module.exports={Mail};
