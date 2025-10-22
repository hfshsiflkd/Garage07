import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } =
  process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // 465 бол true (TLS)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendFeedbackMail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: `📩 Шинэ санал ирлээ — ${name}`,
    text: `Нэр: ${name}\nИмэйл: ${email}\n\n${message}`,
    html: `
      <h2>Шинэ санал ирлээ</h2>
      <p><b>Нэр:</b> ${name}</p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });
}
