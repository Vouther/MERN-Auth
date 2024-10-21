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
        console.error(`Error al enviar el correo de verificación a ${email}: ${err.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {

    const recipient = [{ email }];

    try{
        const response = await client.send({
            from: sender,
            to: recipient,  // Corrige aquí
            template_uuid: "65cb28d7-b790-404b-b71b-f1e9ed6bef35",
            template_variables: {
                "company_info_name": "JOI Fundation",
                "name": name
            }
        });

        console.log("Correo de bienvenida enviado correctamente", response);

    }  catch (err) {
        console.error(`Error al enviar el correo de bienvenida a ${email}: ${err.message}`);
    }

};