Para correr el proyecto en la terminal colocar lo siguiente: git clone https://github.com/ShintaroSAE/PaginaWebSeguridad.git

Al copiar el proyecto moverse a la carpeta usando "cd PaginaWebSeguridad" y "cd pagina-web-seguridad"

Instalar las dependencias con: "npm install"

Crear un archivo de nombre ".env.local" el cual debe contener lo siguiente:

MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxx.mongodb.net/
JWT_SECRET=unaClaveParaFirmarTokens
ADMIN_SECRET=laClaveParaAdmin

Finalmente correr el proyecto con "npm run dev" y abrirlo en un navegador con: http://localhost:3000

