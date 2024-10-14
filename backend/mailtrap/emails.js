import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrapConfig.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Verifica tu correo electrónico",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification"
        });

        console.log(`Correo de verificación enviado a ${email}`, response);
    } catch (err) {
        // Registro detallado del error
        console.error(`Error al enviar correo de verificación a ${email}: ${err.message}`);
    }
};