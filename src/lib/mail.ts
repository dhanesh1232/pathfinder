import nodemailer from "nodemailer";

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export const sendThankYouEmail = async (to: string, name: string) => {
  const mailOptions = {
    from: `${process.env.SMTP_FROM} <${process.env.SMTP_USER}>`,
    to,
    subject: "Thank You for Reaching Out to Pathfinders",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; }
            .header { padding: 40px 20px; text-align: center; background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%); border-bottom: 1px solid #1a1a1a; }
            .logo { font-size: 28px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; }
            .logo span { color: #2ecc71; }
            .content { padding: 40px 30px; text-align: center; }
            .greeting { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #ffffff; }
            .message { font-size: 16px; line-height: 1.8; color: #a1a1aa; margin-bottom: 30px; }
            .footer { padding: 30px 20px; text-align: center; background-color: #000000; border-top: 1px solid #1a1a1a; }
            .slogan { font-size: 14px; font-style: italic; color: #71717a; margin-bottom: 20px; }
            .social-links { margin-bottom: 20px; }
            .social-link { display: inline-block; margin: 0 12px; vertical-align: middle; }
            .address { font-size: 12px; color: #52525b; line-height: 1.5; }
            .brand-name { color: #2ecc71; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Path<span>finders</span></div>
            </div>
            <div class="content">
              <div class="greeting">Hello ${name}!</div>
              <p class="message">
                Thank you for reaching out to <strong>Pathfinders Agency</strong>. We've successfully received your inquiry and our strategy team is already reviewing your details. 
                <br><br>
                Expect a response from us within the next 24-48 hours. We're excited about the possibility of building something great together.
              </p>
            </div>
            <div class="footer">
              <div class="slogan">"Where brands find their path."</div>
              <div class="social-links">
                <a href="${process.env.INSTAGRAM_URL || "#"}" class="social-link">
                  <img src="https://img.icons8.com/ios-filled/32/2ecc71/instagram-new.png" width="24" height="24" alt="Instagram" style="display: inline-block;">
                </a>
                <a href="${process.env.LINKEDIN_URL || "#"}" class="social-link">
                  <img src="https://img.icons8.com/ios-filled/32/2ecc71/linkedin.png" width="24" height="24" alt="LinkedIn" style="display: inline-block;">
                </a>
                <a href="${process.env.WEBSITE_URL || "#"}" class="social-link">
                  <img src="https://img.icons8.com/ios-filled/32/2ecc71/globe.png" width="24" height="24" alt="Website" style="display: inline-block;">
                </a>
              </div>
              <div class="address">
                &copy; ${new Date().getFullYear()} Pathfinders Agency. All rights reserved.<br>
                Creative Excellence Delivered Globally.
              </div>
              <div class="brand-name">PATHFINDERS AGENCY</div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Thank you email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw, we don't want to break the submission flow if email fails
  }
};
