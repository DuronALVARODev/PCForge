const nodemailer = require('nodemailer');

// Configuración del transporter para envío de correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envía un correo de verificación de cuenta
 * @param {string} to - Email de destino
 * @param {string} token - Token de verificación
 */
const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"PCForge" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verifica tu cuenta en PCForge',
    html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta: </p><a href="${verificationLink}">${verificationLink}</a>`,
  });
};

module.exports = { sendVerificationEmail };