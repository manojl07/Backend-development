const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

exports.sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your account",
    html: `<h2>Your OTP is: ${otp}</h2><p>Expires in 5 minutes</p>`
  })
}