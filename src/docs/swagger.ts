import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app: Application) => {
  try {
    // Buscamos el archivo en la misma carpeta que este script ejecutado
    const yamlPath = path.join(__dirname, 'openapi.yaml');

    if (!fs.existsSync(yamlPath)) {
      // Log de ayuda para saber qué está viendo Docker realmente
      console.error(`⚠️ Archivo NO encontrado en: ${yamlPath}`);
      console.log(`Directorio actual: ${__dirname}`);
      return;
    }

    const swaggerDocument = yaml.load(fs.readFileSync(yamlPath, 'utf8')) as any;

    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        swaggerOptions: { persistAuthorization: true },
        customSiteTitle: 'Microblogging API Docs',
      }),
    );

    console.log('📖 Swagger cargado correctamente desde openapi.yaml');
  } catch (error) {
    console.error('❌ Error crítico en Swagger:', error);
  }
};
