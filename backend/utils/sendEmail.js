import nodemailer from "nodemailer";
 
const createTransporter = () => nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,         // TLS via STARTTLS on port 587
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false  // needed on some cloud hosts
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000
});
 
export const sendPasswordResetEmail = async ({ toEmail, resetUrl, userName }) => {
  await createTransporter().sendMail({
    from: `"A Louder Voice" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your Password — A Louder Voice",
    html: `<!DOCTYPE html><html><head><style>
      body{margin:0;padding:0;background:#F4F0E6;font-family:Georgia,serif}
      .c{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E0DBD1}
      .h{background:#0A0A0A;padding:32px 40px;text-align:center}
      .h h1{color:#F4F0E6;font-size:24px;font-weight:300;letter-spacing:2px;margin:0}
      .b{padding:40px}.b p{color:#0A0A0A;font-size:15px;line-height:1.8}
      .btn{display:block;width:fit-content;margin:28px auto;background:#C5A059;color:#fff;
           text-decoration:none;padding:14px 36px;font-size:13px;letter-spacing:2px;text-transform:uppercase}
      .note{font-size:12px;color:#999;margin-top:20px}
      .f{background:#F4F0E6;padding:20px 40px;text-align:center;font-size:11px;color:#999;border-top:1px solid #E0DBD1}
    </style></head><body><div class="c">
      <div class="h"><h1>A <span style="color:#C5A059">Louder</span> Voice</h1></div>
      <div class="b">
        <p>Hi ${userName || "there"},</p>
        <p>We received a request to reset your A Louder Voice password.</p>
        <p>Click below to set a new password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" class="btn">Reset My Password</a>
        <p class="note">If you didn't request this, ignore this email — your password stays the same.</p>
        <p class="note">Link not working? Copy and paste:<br/>
          <a href="${resetUrl}" style="color:#C5A059;word-break:break-all">${resetUrl}</a>
        </p>
      </div>
      <div class="f">© ${new Date().getFullYear()} A Louder Voice · aloudervoice.co.za</div>
    </div></body></html>`
  });
};
 
export const sendContactEmail = async ({ fromName, fromEmail, subject: subj, message }) => {
  const t = createTransporter();
  await t.sendMail({
    from: `"A Louder Voice Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: fromEmail,
    subject: `[Contact] ${subj || "New message"} — from ${fromName}`,
    html: `<!DOCTYPE html><html><head><style>
      body{margin:0;padding:0;background:#F4F0E6;font-family:Georgia,serif}
      .c{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E0DBD1}
      .h{background:#0A0A0A;padding:28px 36px}
      .h h1{color:#F4F0E6;font-size:20px;font-weight:300;letter-spacing:2px;margin:0}
      .b{padding:36px}.label{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#C5A059;margin-bottom:4px}
      .val{font-size:15px;color:#0A0A0A;margin-bottom:20px;line-height:1.7}
      hr{border:none;border-top:1px solid #E0DBD1;margin:20px 0}
      .f{background:#F4F0E6;padding:16px;text-align:center;font-size:11px;color:#999;border-top:1px solid #E0DBD1}
    </style></head><body><div class="c">
      <div class="h"><h1>A <span style="color:#C5A059">Louder</span> Voice — New Message</h1></div>
      <div class="b">
        <div class="label">From</div><div class="val">${fromName}</div>
        <div class="label">Email</div><div class="val"><a href="mailto:${fromEmail}" style="color:#C5A059">${fromEmail}</a></div>
        <div class="label">Subject</div><div class="val">${subj || "General enquiry"}</div>
        <hr/>
        <div class="label">Message</div>
        <div class="val">${message.replace(/\n/g, "<br/>")}</div>
      </div>
      <div class="f">Sent via aloudervoice.co.za · Hit Reply to respond directly</div>
    </div></body></html>`
  });
 
  await t.sendMail({
    from: `"A Louder Voice" <${process.env.EMAIL_USER}>`,
    to: fromEmail,
    subject: "We got your message — A Louder Voice",
    html: `<!DOCTYPE html><html><head><style>
      body{margin:0;padding:0;background:#F4F0E6;font-family:Georgia,serif}
      .c{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E0DBD1}
      .h{background:#0A0A0A;padding:32px 40px;text-align:center}
      .h h1{color:#F4F0E6;font-size:24px;font-weight:300;letter-spacing:2px;margin:0}
      .b{padding:40px;color:#0A0A0A;font-size:15px;line-height:1.8}
      .f{background:#F4F0E6;padding:20px 40px;text-align:center;font-size:11px;color:#999;border-top:1px solid #E0DBD1}
    </style></head><body><div class="c">
      <div class="h"><h1>A <span style="color:#C5A059">Louder</span> Voice</h1></div>
      <div class="b">
        <p>Hi ${fromName},</p>
        <p>Thank you for reaching out! We've received your message and will respond as soon as possible.</p>
        <p>While you wait, explore our platform:</p>
        <ul>
          <li><a href="https://aloudervoice.co.za/letters" style="color:#C5A059">Unsent Letters</a></li>
          <li><a href="https://aloudervoice.co.za/engagement" style="color:#C5A059">Engagement</a></li>
          <li><a href="https://aloudervoice.co.za/smme" style="color:#C5A059">SMME Stories</a></li>
        </ul>
        <p>Warmly,<br/>The A Louder Voice Team</p>
      </div>
      <div class="f">© ${new Date().getFullYear()} A Louder Voice · aloudervoice.co.za</div>
    </div></body></html>`
  });
};
 
export const sendPasswordChangedEmail = async ({ toEmail, userName }) => {
  await createTransporter().sendMail({
    from: `"A Louder Voice" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your password was changed — A Louder Voice",
    html: `<div style="max-width:560px;margin:40px auto;font-family:Georgia,serif;background:#fff;border:1px solid #E0DBD1">
      <div style="background:#0A0A0A;padding:28px;text-align:center">
        <h1 style="color:#F4F0E6;font-size:22px;font-weight:300;letter-spacing:2px;margin:0">A <span style="color:#C5A059">Louder</span> Voice</h1>
      </div>
      <div style="padding:36px;color:#0A0A0A;font-size:15px;line-height:1.8">
        <p>Hi ${userName || "there"},</p>
        <p>Your password has been successfully changed.</p>
        <p>If you did NOT make this change, contact us immediately at
          <a href="mailto:TshegoIsithebe@gmail.com" style="color:#C5A059">TshegoIsithebe@gmail.com</a>
        </p>
      </div>
      <div style="background:#F4F0E6;padding:16px;text-align:center;font-size:11px;color:#999;border-top:1px solid #E0DBD1">
        © ${new Date().getFullYear()} A Louder Voice
      </div>
    </div>`
  });
};
 
export const sendSubmissionStatusEmail = async ({ toEmail, userName, status, postTitle, postUrl }) => {
  const approved = status === "approved";
  await createTransporter().sendMail({
    from: `"A Louder Voice" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: approved
      ? `Your submission was published — A Louder Voice`
      : `Update on your submission — A Louder Voice`,
    html: `<div style="max-width:560px;margin:40px auto;font-family:Georgia,serif;background:#fff;border:1px solid #E0DBD1">
      <div style="background:#0A0A0A;padding:28px;text-align:center">
        <h1 style="color:#F4F0E6;font-size:22px;font-weight:300;letter-spacing:2px;margin:0">A <span style="color:#C5A059">Louder</span> Voice</h1>
      </div>
      <div style="padding:36px;color:#0A0A0A;font-size:15px;line-height:1.8">
        <p>Hi ${userName || "there"},</p>
        ${approved
          ? `<p>Great news! Your submission <strong>"${postTitle || "your story"}"</strong> has been reviewed and published on A Louder Voice.</p>
             ${postUrl ? `<a href="${postUrl}" style="display:inline-block;background:#C5A059;color:#fff;text-decoration:none;padding:12px 28px;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:16px 0">Read It Live</a>` : ""}
             <p>Thank you for sharing your voice with our community.</p>`
          : `<p>Thank you for submitting to A Louder Voice. After careful review, your submission <strong>"${postTitle || "your story"}"</strong> was not approved for publication at this time.</p>
             <p>This could be due to content guidelines, relevance, or editorial fit. You're welcome to submit other stories — we'd love to hear from you again.</p>`
        }
        <p>Warmly,<br/>The A Louder Voice Team</p>
      </div>
      <div style="background:#F4F0E6;padding:16px;text-align:center;font-size:11px;color:#999;border-top:1px solid #E0DBD1">
        © ${new Date().getFullYear()} A Louder Voice · aloudervoice.co.za
      </div>
    </div>`
  });
};