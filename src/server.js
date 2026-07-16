require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const port = process.env.PORT || 3000;

async function main() {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});
