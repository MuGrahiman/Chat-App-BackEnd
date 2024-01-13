import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

  // ----------mail transporter----------------
 const Transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.Mailer_Mail,
      pass: process.env.Mailer_TOKEN,
    },
  });

  export default Transporter