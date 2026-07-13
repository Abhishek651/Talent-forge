const { otpEmailTemplate } = require("../template/otpTemplate");

async function sendEmail(email, otp) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Email sending is not configured for production.");
  }

  const dns = require("dns");
  dns.setDefaultResultOrder("ipv4first");
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"TalentForge" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your TalentForge account",
      html: otpEmailTemplate(otp),
    });
    console.log("Email sent via Nodemailer");
  } catch (err) {
    console.error("Email send error:", err);
    throw err;
  }
}

module.exports = { sendEmail };
