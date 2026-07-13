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
  try {
    // Check SMTP connection
    await transporter.verify();
    console.log("SMTP connection successful");

    // Send email
    await transporter.sendMail({
      from: `"TalentForge" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your TalentForge account",
      html: otpEmailTemplate(otp),
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("SMTP Error:", err);
    throw err;
  }
}

module.exports = { sendEmail };