import Transporter from '../Config/nodemail-config.js';

// ----------------sending mail -----------------
export const sendMail = (mailOptions) => {
	return new Promise((resolve, reject) => {
		Transporter.sendMail(mailOptions, (err, data) => {
			if (err) {
				reject(err);
			} else {
				console.log('Mail sent successfully');
				resolve((data.success = 'Mail sent successfully'));
			}
		});
	});
};
