import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({
  to_name,
  to_email,
  asunto_dinamico,
  cuerpo_mensaje,
}) => {
  try {
    const mailOptions = {
      from: `"Wavv Music" <${process.env.EMAIL_USER}>`,
      to: to_email,
      subject: asunto_dinamico,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; padding: 40px; border-radius: 12px; border: 1px solid #2d2d2d;">
          
          <h1 style="color: #5773ff; text-align: center; margin-top: 0; font-size: 24px;">
            ${asunto_dinamico}
          </h1>
          
          <p style="color: #f5f5f5; font-size: 16px; line-height: 1.6; margin: 24px 0;">
            ¡Hola <strong style="color: #5773ff;">${to_name}</strong>!
          </p>
          
          <p style="color: #f5f5f5; font-size: 16px; line-height: 1.6; margin: 20px 0;">
            ${cuerpo_mensaje}
          </p>
          
          <hr style="border: none; border-top: 1px solid #333333; margin: 32px 0;">
          
          <p style="color: #919191; font-size: 14px; text-align: center; line-height: 1.6; margin-bottom: 0;">
            Si tenés alguna duda, respondé a este correo o contactanos por la app.<br><br>
            ¡Estamos en sintonía! 🎵<br>
            © ${new Date().getFullYear()} Wavv Music. Todos los derechos reservados.
          </p>

        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error enviando email con Nodemailer:", error);
    return { success: false, error: error.message };
  }
};
