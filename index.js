import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors';

import bibliothequeRoutes from './src/routes/bibliotheque.routes.js';
import livresRoutes from './src/routes/livres.routes.js';
import pretsRoutes from './src/routes/prets.routes.js';

dotenv.config();
const app = express();
app.use(cors()); // pour la version local du page html parce que les ports sont différents :3000(local) vs :5173(go livre sur vscode))
const PORT = process.env.PORT || 3000;
app.use(express.json());

//journal des erreurs
const logStream = fs.createWriteStream('./erreurs.log', { flags: 'a' });
//inspire de : https://www.npmjs.com/package/morgan
app.use(morgan('combined', { stream: logStream , skip: function (req, res) { return res.statusCode < 500 }}));

//documnetation Swagger
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Bibliothèque"
};
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

//routes
app.use('/api/bibliotheque', bibliothequeRoutes);
app.use('/api/livres', livresRoutes);
app.use('/api', pretsRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});