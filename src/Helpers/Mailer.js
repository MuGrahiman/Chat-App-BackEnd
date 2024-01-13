// Helper class
import { sendMail } from "../Utilities/Mailer";

class Mailer {
  constructor(to, subject, body) {
    this.options = {
      from: process.env.Mailer_Mail,
      to: to,
      subject: subject,
      text: body, 
    };
  }

  sendMail() {
    return sendMail(this.options);
  }
}

export default Mailer;
