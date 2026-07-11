function otpEmailTemplate(otp) {
  // Ensure OTP is a string
  const otpString = String(otp);
  
  // Generate the individual boxes for visual appeal
  const boxes = otpString
    .split("")
    .map(
      (d) => `
      <td style="padding: 0 4px;">
        <div style="
          width: 44px;
          height: 52px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 24px;
          font-weight: 600;
          color: #0f172a;
          text-align: center;
          line-height: 52px;
          font-family: ui-monospace, 'Courier New', monospace;
        ">${d}</div>
      </td>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

            <!-- LOGO / BRAND -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <h1 style="margin: 0; font-size: 24px; color: #1e293b; font-weight: 700; letter-spacing: -0.5px;">TalentForge</h1>
                <p style="margin: 4px 0 0; font-size: 14px; color: #64748b; font-weight: 500;">AI-Powered Interview Platform</p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td align="center" style="padding-bottom: 32px;">
                <div style="height: 1px; background-color: #e2e8f0; width: 100%;"></div>
              </td>
            </tr>

            <!-- HEADING -->
            <tr>
              <td align="center" style="padding-bottom: 12px;">
                <h2 style="margin: 0; font-size: 20px; color: #0f172a; font-weight: 600;">Verify your email</h2>
              </td>
            </tr>

            <!-- SUBTEXT -->
            <tr>
              <td align="center" style="padding-bottom: 32px;">
                <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.5;">
                  Enter the 6-digit code below to verify your account.<br/>
                  This code expires in <strong>10 minutes</strong>.
                </p>
              </td>
            </tr>

            
            

            <!-- EASY COPY BLOCK -->
            <tr>
              <td align="center" style="padding-bottom: 32px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">Tap and hold the code below to copy:</p>
                <div style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: 4px; font-family: ui-monospace, 'Courier New', monospace;">
                  ${otpString}
                </div>
              </td>
            </tr>

            <!-- WARNING -->
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                  If you didn't create a TalentForge account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td align="center" style="padding-bottom: 16px;">
                <div style="height: 1px; background-color: #e2e8f0; width: 100%;"></div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center">
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">
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