export function verifyEmailTemplate(name: string, verifyUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verifikasi Email — WorkCircle</title>
</head>
<body style="margin:0;padding:0;background:#07070A;font-family:monospace,monospace;color:#FFFFFF;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="480" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;">WorkCircle</p>
              <h1 style="margin:0 0 24px;font-size:20px;font-weight:700;color:#FFFFFF;">Verifikasi Email Kamu</h1>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.7);">
                Halo <strong style="color:#FFFFFF;">${name}</strong>,
              </p>
              <p style="margin:0 0 32px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.7);">
                Klik tombol di bawah untuk memverifikasi alamat email kamu dan mulai menggunakan WorkCircle.
              </p>
              <a href="${verifyUrl}" style="display:inline-block;background:#FFFFFF;color:#07070A;font-family:monospace,monospace;font-size:13px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:6px;letter-spacing:0.02em;">
                Verifikasi Email
              </a>
              <p style="margin:32px 0 0;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                Link ini berlaku selama 24 jam. Jika kamu tidak mendaftar di WorkCircle, abaikan email ini.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
                WorkCircle — Temukan komunitas kerja yang tepat.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
