const nodemailer = require('nodemailer')

const trnasporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS
  }
})


exports.sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Manoj Pvt Ltd" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your verification code",
    html: `
      <div style="margin:0; padding:0; background-color:#0f172a; font-family: Inter, Arial, sans-serif;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                
                <!-- Header -->
                <tr>
                  <td style="padding:30px 30px 10px 30px; text-align:center;">
                    <h1 style="margin:0; font-size:22px; color:#0f172a; font-weight:600;">
                      Verify your account
                    </h1>
                  </td>
                </tr>

                <!-- Subtitle -->
                <tr>
                  <td style="padding:0 30px; text-align:center;">
                    <p style="margin:0; font-size:14px; color:#64748b;">
                      Enter the code below to continue
                    </p>
                  </td>
                </tr>

                <!-- OTP Box -->
                <tr>
                  <td align="center" style="padding:30px;">
                    <div style="
                      display:inline-block;
                      padding:18px 28px;
                      font-size:32px;
                      letter-spacing:10px;
                      font-weight:700;
                      color:#0f172a;
                      background:linear-gradient(135deg,#e0e7ff,#f1f5f9);
                      border-radius:12px;
                      border:1px solid #e2e8f0;
                    ">
                      ${otp}
                    </div>
                  </td>
                </tr>

                <!-- Info -->
                <tr>
                  <td style="padding:0 30px; text-align:center;">
                    <p style="font-size:13px; color:#94a3b8; margin:0;">
                      This code expires in <b style="color:#0f172a;">5 minutes</b>
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:25px 30px;">
                    <hr style="border:none; border-top:1px solid #e2e8f0;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:0 30px 30px 30px; text-align:center;">
                    <p style="font-size:12px; color:#94a3b8; margin:0;">
                      Didn’t request this? You can safely ignore this email.
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Branding -->
              <p style="color:#64748b; font-size:12px; margin-top:20px;">
                © ${new Date().getFullYear()} Manoj Pvt Ltd
              </p>

            </td>
          </tr>
        </table>

      </div>
    `
  })
}