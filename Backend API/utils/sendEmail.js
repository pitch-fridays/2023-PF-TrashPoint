const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.MAILER_PORT,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: "gutettapjidanjuma2017@yahoo.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent successfully");
    } catch (error) {
        console.error(error, "email not sent");
    }
};

module.exports = sendEmail;
