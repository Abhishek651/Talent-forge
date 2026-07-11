const nodemailer = require("nodemailer");
const { otpEmailTemplate } = require("../template/otpTemplate");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(email, otp) {
  await transporter.sendMail({
    from: `"TalentForge" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your TalentForge account",
    html: otpEmailTemplate(otp),
  });
}

module.exports = { sendEmail };
