Atajo terminal: ctrl + j

1- npm init -y
2- npm i express cookie-parser mailtrap bcryptjs dotenv jsonwebtoken mongoose crypto

**Express:

Descripción: Un framework minimalista para construir aplicaciones web en Node.js.
Uso: Facilita la creación de servidores HTTP y manejar rutas y middleware de manera eficiente.

**cookie-parser:

Descripción: Middleware para Express que permite analizar las cookies en las solicitudes HTTP.
Uso: Extrae cookies del cliente y las convierte en un objeto accesible desde el servidor.

**mailtrap:

Descripción: Una herramienta que simula un servidor de correo para pruebas.
Uso: Permite enviar correos de prueba sin enviarlos realmente a direcciones reales. Ideal para desarrollo y pruebas de aplicaciones que envían correos electrónicos.

**bcryptjs:

Descripción: Biblioteca para encriptar contraseñas utilizando el algoritmo bcrypt.
Uso: Se utiliza comúnmente para hashear contraseñas antes de almacenarlas en una base de datos, proporcionando mayor seguridad.

**dotenv:

Descripción: Una librería que carga variables de entorno desde un archivo .env en process.env.
Uso: Facilita la gestión de configuraciones sensibles (como claves API, configuraciones de base de datos, etc.) sin exponerlas en el código fuente.

**jsonwebtoken:

Descripción: Biblioteca para trabajar con tokens JWT (JSON Web Tokens).
Uso: Se utiliza para la autenticación y autorización en aplicaciones web, emitiendo y verificando tokens seguros.

**mongoose:

Descripción: Una biblioteca de modelado de datos para MongoDB y Node.js.
Uso: Simplifica el trabajo con MongoDB, proporcionando un esquema estricto y métodos para interactuar con la base de datos.

**crypto:

Descripción: Módulo nativo de Node.js que proporciona funciones de criptografía.
Uso: Ofrece herramientas para el cifrado de datos, creación de hash y generación de claves seguras, entre otras tareas relacionadas con la criptografía.

3- npm i nodemon -D

**Nodemon:

Descripción: Es una herramienta que reinicia automáticamente tu servidor Node.js cada vez que detecta cambios en los archivos del proyecto.
Uso: Facilita el desarrollo porque no necesitas reiniciar manualmente el servidor cada vez que realizas una modificación en el código. Nodemon se encarga de observar los archivos y reiniciar el servidor si hay cambios.

**Opción -D:

Significado: Indica que la dependencia debe instalarse como una dependencia de desarrollo (development dependency). Esto significa que Nodemon solo se utilizará durante el proceso de desarrollo y no será necesario en el entorno de producción.

4- en package.jso agregamos "type" : "module"

Con "type": "module" habilitado, el proyecto está configurado para usar los módulos ECMAScript (ESM) en lugar del sistema de módulos tradicional de Node.js, conocido como CommonJS. Esto significa que:
ESM (Módulos ES) usa las siguientes palabras clave:
import y export.
CommonJS usa:
require() y module.exports.

5- Probar servidor con node index.js

Para realizar la verificacion de email, envio de menasajes de bienvenida o cambio de contraseña instalamos mailtrap.
Probamos que este todo correcto con:
$ node ./mailtrap/mailtrapConfig.js