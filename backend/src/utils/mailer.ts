import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM = "Garage07 <no-reply@garage07.mn>",
  MAIL_TO = "the07garage@gmail.com",
  BRAND_NAME = "Garage07",
  BRAND_URL = "https://your-domain.example",
  BRAND_LOGO = "https://your-domain.example/logo-email.png", // хүсвэл локал ч байж болно
} = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Жижиг escape туслах (HTML-д оруулах аюулгүй болгоно)
const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml({
  name,
  email,
  message,
}: {
  name: string;
  email?: string;
  message: string;
}) {
  const safeName = esc(name || "Үл мэдэгдэх");
  const safeEmail = esc(email || "");
  const safeMessage = esc(message || "").replace(/\n/g, "<br>");

  // Preheader – ихэнх клиент subject-ын дараа жижиг сүүдэр тайлбар харуулна
  const preheader = "Хэрэглэгчээс шинэ санал ирлээ. Дотор нь нээж үзнэ үү.";

  return `
<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${BRAND_NAME} — Шинэ санал</title>
  <style>
    /* Mobile tweaks */
    @media (max-width:600px){
      .container{ width:100% !important; padding:16px !important; }
      .card{ padding:18px !important; }
      .footer{ padding:16px !important; }
    }
    .btn{ background:#a7ffea; color:#000 !important; text-decoration:none; display:inline-block; padding:10px 16px; border-radius:10px; font-weight:700; }
    .muted{ color:#88919e; }
  </style>
</head>
<body style="margin:0; background:#0b0b0d; font-family:ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#fff;">
  <!-- Invisible preheader -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0d;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" style="width:560px; max-width:100%; padding:0;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:8px 0 16px;">
              <a href="${BRAND_URL}" target="_blank" style="text-decoration:none;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="font-size:18px; font-weight:800; letter-spacing:.3px; color:#fff;">${BRAND_NAME}</div>
                      <div style="font-size:12px; color:#a7ffea;">Wheel • Good music • Late nights</div>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card" style="background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); border:1px solid rgba(255,255,255,.12); border-radius:16px; padding:24px;">
                <tr>
                  <td>
                    <div style="font-size:20px; font-weight:800; margin-bottom:6px;">📩 Шинэ санал ирлээ</div>
                    <div class="muted" style="font-size:13px; color:#cbd5e1;">Хэрэглэгч дараах мэдээллийг илгээлээ:</div>
                    <hr style="border:none; border-top:1px solid rgba(255,255,255,.08); margin:16px 0;" />

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:6px 0; width:120px;" class="muted">Нэр</td>
                        <td style="padding:6px 0; font-weight:600;">${safeName}</td>
                      </tr>
                      ${
                        safeEmail
                          ? `<tr>
                              <td style="padding:6px 0;" class="muted">Имэйл</td>
                              <td style="padding:6px 0; font-weight:600;">${safeEmail}</td>
                            </tr>`
                          : ""
                      }
                      <tr>
                        <td style="padding:6px 0; vertical-align:top;" class="muted">Мессеж</td>
                        <td style="padding:6px 0; line-height:1.6;">${safeMessage}</td>
                      </tr>
                    </table>

                    <div style="margin-top:18px; font-size:12px; color:#94a3b8;">
                      Ирсэн огноо: ${new Date().toLocaleString("mn-MN")}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer" align="center" style="padding:20px 8px 8px; color:#94a3b8; font-size:12px;">
              © ${new Date().getFullYear()} ${BRAND_NAME}. Бүх эрх хуулиар хамгаалагдсан.
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

export async function sendFeedbackMail({
  name,
  email,
  message,
}: {
  name: string;
  email?: string;
  message: string;
}) {
  const subject = `📩 Шинэ санал ирлээ — ${name || "Үл мэдэгдэх"}`;

  const text = [
    `Шинэ санал ирлээ`,
    `Нэр: ${name || "Үл мэдэгдэх"}`,
    email ? `Имэйл: ${email}` : "",
    ``,
    message || "",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject,
    text, // plaintext fallback
    html: buildHtml({ name, email, message }),
    ...(email ? { replyTo: email } : {}),
  });
}
