function otpEmailTemplate(otp) {
  const digits = String(otp).split("");

  const boxes = digits
    .map(
      (d) => `
      <td style="padding: 0 6px;">
        <div style="
          width: 48px;
          height: 56px;
          background: #f3f4f6;
          border: 2px solid #1f4e79;
          border-radius: 8px;
          font-size: 28px;
          font-weight: bold;
          color: #111111;
          text-align: center;
          line-height: 56px;
          font-family: 'Courier New', monospace;
        ">${d}</div>
      </td>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 40px;">

            <!-- LOGO / BRAND -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <h1 style="margin: 0; font-size: 22px; color: #1f4e79; letter-spacing: 1px;">TalentForge</h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: #888;">AI-Powered Interview Platform</p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="border-top: 1px solid #e5e7eb; padding-bottom: 24px;"></td>
            </tr>

            <!-- HEADING -->
            <tr>
              <td align="center" style="padding-bottom: 8px;">
                <h2 style="margin: 0; font-size: 20px; color: #111111;">Verify your email</h2>
              </td>
            </tr>

            <!-- SUBTEXT -->
            <tr>
              <td align="center" style="padding-bottom: 32px;">
                <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">
                  Enter the 6-digit code below to verify your TalentForge account.<br/>
                  This code expires in <strong>10 minutes</strong>.
                </p>
              </td>
            </tr>

            <!-- OTP BOXES -->
            <tr>
              <td align="center" style="padding-bottom: 32px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>${boxes}</tr>
                </table>
              </td>
            </tr>

            <!-- WARNING -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #888888;">
                  If you didn't create a TalentForge account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="border-top: 1px solid #e5e7eb; padding-bottom: 16px;"></td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center">
                <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                  &copy; ${new Date().getFullYear()} TalentForge. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}

module.exports = { otpEmailTemplate };
