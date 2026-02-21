import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to_name,
  to_email,
  asunto_dinamico,
  cuerpo_mensaje,
}) => {
  try {
    await resend.emails.send({
      from: 'Wavv Music <onboarding@resend.dev>',
      to: to_email,
      subject: asunto_dinamico,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%); padding: 40px; border-radius: 10px;">
          <h1 style="color: #5773ff; text-align: center;">${asunto_dinamico}</h1>
          <p style="color: #ffffff; font-size: 16px;">¡Hola <strong>${to_name}</strong>!</p>
          <p style="color: #ffffff; font-size: 16px;">${cuerpo_mensaje}</p>
          <hr style="border: 1px solid #999999; margin: 30px 0;">
          <p style="color: #919191; font-size: 14px; text-align: center;">
            Si tenés alguna duda, respondé a este correo o contactanos por la app.<br><br>
            ¡Estamos en sintonía! <br>
            © 2026 Wavv Music. Todos los derechos reservados.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
