const nodemailer = require('nodemailer');

export const SendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        port: parseInt(process.env.SMTP_PORT as string, 10),
        // service: process.env.SMPT_SERVICE,
        secure: true,
        requireTLS: false,
        auth: {
            user: process.env.SMTP_USER as string,
            pass: process.env.SMTP_PASS as string
        }
    })

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        ...(options.html ? { html: options.template } : { text: options.message }),
    }


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return { success: true };
    } catch (error) {
        console.error("Email sending error:", error.message);
        return { success: false, message: error.message };
    }
}