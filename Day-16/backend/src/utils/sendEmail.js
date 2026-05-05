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
    from: `"Manoj Pvt Ltd" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your account",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <h2 style="color: #333;">Verify Your Account</h2>
          
          <p style="color: #555; font-size: 14px;">
            Use the OTP below to complete your registration.
          </p>

          <div style="margin: 20px 0;">
            <span style="
              display: inline-block;
              font-size: 28px;
              letter-spacing: 6px;
              font-weight: bold;
              color: #2d89ef;
              background: #f1f5ff;
              padding: 12px 20px;
              border-radius: 8px;
            ">
              ${otp}
            </span>
          </div>

          <p style="color: #888; font-size: 13px;">
            This OTP will expire in <b>5 minutes</b>.
          </p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 12px; color: #aaa;">
            If you didn’t request this, you can safely ignore this email.
          </p>

        </div>

      </div>
    `
  })
}