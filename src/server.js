require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const port = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Servidor iniciado en puerto ${port}`);
      console.log(`📚 Documentación: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

// Manejo graceful del cierre
process.on('SIGINT', async () => {
  console.log('🔄 Cerrando conexiones...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Cerrando conexiones...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch(async (error) => {
  console.error('💥 Error fatal:', error);
  await prisma.$disconnect();
  process.exit(1);
});
