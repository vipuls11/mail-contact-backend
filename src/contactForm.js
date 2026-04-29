import nodemailer from "nodemailer";

export const contactForm = async (req, res) => {
  const { name, email, message } = req.body;

console.log(req.body);
  try {
    const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  requireTLS: true,
  family: 4, // 👈 force IPv4 (important)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password (not normal password)
      },
    });
  
     await transporter.verify();
     console.log("SMTP working");
const adminNotificationHtml = `
  <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #0f172a; padding: 20px; color: #ffffff;">
      <h2 style="margin: 0; font-size: 18px;">🚀 New Lead Received</h2>
    </div>
    
    <div style="padding: 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 100px;">Name:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Email:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${email}</td>
        </tr>
      </table>

      <p style="color: #64748b; margin-top: 20px; margin-bottom: 5px;">Message:</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; color: #334155; line-height: 1.5;">
        ${message.replace(/\n/g, '<br/>')}
      </div>
    </div>

    <div style="padding: 20px; background-color: #f8fafc; text-align: center;">
      <a href="mailto:${email}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Reply to ${name}
      </a>
    </div>
  </div>
`;
    // 1. Mail to YOU
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name}`,
      html: adminNotificationHtml,
    });

    const emailHtml = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
    <div style="background-color: #2563eb; padding: 30px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0;">Message Received!</h2>
    </div>
    
    <div style="padding: 30px;">
      <h3 style="color: #333333; margin-top: 0;">Hi ${name},</h3>
      <p style="color: #555555; line-height: 1.6; font-size: 16px;">
        Thank you for reaching out! I have received your message and appreciate you taking the time to connect. I typically respond within 24-48 hours.
      </p>
      
      <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px;">
        <p style="margin: 0; color: #475569; font-style: italic;">
          "Building connections is the first step to great innovation."
        </p>
      </div>

      <p style="color: #555555; line-height: 1.6;">Best regards,</p>
      <p style="color: #333333; font-weight: bold; margin-top: -10px;">Vipul Vishwakarma</p>
    </div>

    <div style="padding: 20px; text-align: center; background-color: #f1f5f9; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0;">Sent from my Portfolio Website</p>
    </div>
  </div>
`;
    // 2. Auto-reply to USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for contacting me!",
      html: emailHtml,
    });

    res.status(200).json({ message: "Message sent successfully" });

  } catch (error) {
      console.error("EMAIL ERROR:", error); // 👈 ADD THIS
    res.status(500).json({ message: "Error sending message" });
  }
};