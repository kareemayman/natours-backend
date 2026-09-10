const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

exports.sendResetEmail = async function (to, resetUrl) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    `,
  })
}
